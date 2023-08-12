from flask import Flask, jsonify, request
from flask_cors import CORS
import pymysql, jwt
from jwt import encode
from datetime import datetime, timedelta

# from flask_bcrypt import Bcrypt

app = Flask(__name__)
CORS(app)
# bcrypt = Bcrypt(app)

SECRET_KEY = "my-secret-key"

config = {
    "user": "root",
    "password": "2403",
    "host": "localhost",
    "database": "store",
    "charset": "utf8mb4",
    "cursorclass": pymysql.cursors.DictCursor,
}


@app.route("/")
def index():
    data = {"message": "Hello from Flask!", "name": "John Doe", "age": 25}
    return jsonify(data)


@app.route("/api/product_id/<int:product_id>")
def product(product_id):
    conn = pymysql.connect(**config)

    with conn.cursor() as cursor:
        sql = "select p.*, pr.price from product p inner join price pr on p.id= pr.product_id where pr.product_id = %s;"
        cursor.execute(sql, (product_id,))
        product = cursor.fetchone()

    conn.close()
    if product:
        data = {
            "name": product["name"],
            "description": product["description"],
            "img": product["img"],
            "id": product["id"],
            "price": product["price"],
        }
        return jsonify(data)
    else:
        return jsonify({"message": "Product not found"}), 404


@app.route("/api/all_products")
def all_products():
    conn = pymysql.connect(**config)

    with conn.cursor() as cursor:
        sql = "select p.*, pr.price from product p inner join price pr on p.id= pr.product_id order by pr.product_id;"
        cursor.execute(sql)
        products = cursor.fetchall()

    conn.close()
    if products:
        product_list = []
        for product in products:
            data = {
                "name": product["name"],
                "description": product["description"],
                "img": product["img"],
                "id": product["id"],
                "price": product["price"],
            }
            product_list.append(data)
        print("product_list OK")
        return jsonify(product_list)

    else:
        return jsonify({"message": "Product not found"}), 404


# Generate JWT on login
def generate_jwt(user_id):
    payload = {
        "user_id": user_id,
        "exp": datetime.utcnow() + timedelta(days=1),  # Set token expiration time
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")


@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    conn = pymysql.connect(**config)

    with conn.cursor() as cursor:
        sql = "SELECT * FROM user WHERE email = %s AND password = %s"
        cursor.execute(
            sql,
            (
                email,
                password,
            ),
        )
        user = cursor.fetchone()

    conn.close()

    if user:
        user_data = {
            "user_id": user["id"],
            "username": user["username"],
            "email": user["email"],
        }
        # Generate JWT
        access_token = generate_jwt(user_data)

        return jsonify(
            {
                "message": "Login successful",
                "access_token": access_token,
                "user_id": user_data["user_id"],
            }
        )

    return jsonify({"message": "Invalid credentials"}), 401


@app.route("/api/logout", methods=["POST"])
def logout():
    # Assuming you receive the access token in the request JSON
    data = request.json
    access_token = data.get("access_token")

    # Here, you might want to add some validation and error handling for the token
    # For example, you could check if the token is valid and not expired
    # You can use the jwt.decode function for this

    # If the token is valid, you can just return a success message
    return jsonify({"message": "Logout successful"}), 200


@app.route("/api/new_user", methods=["POST"])
def new_user():
    data = request.json
    email = data.get("email")
    username = data.get("username")
    password = data.get("password")

    try:
        conn = pymysql.connect(**config)

        with conn.cursor() as cursor:
            sql = "INSERT INTO user(username, password, email) VALUES (%s, %s, %s)"
            cursor.execute(sql, (username, password, email))

        conn.commit()
        conn.close()

        return (
            jsonify({"message": "User created successfully"}),
            201,
        )  # HTTP status code for created

    except Exception as e:
        print("Error:", e)
        return (
            jsonify({"message": "An error occurred"}),
            500,
        )  # HTTP status code for internal server error


@app.route("/api/cart", methods=["GET"])
def get_cart():
    # Get the user_id from the request headers
    user_id = request.headers.get("X-User-Id")

    conn = pymysql.connect(**config)

    with conn.cursor() as cursor:
        sql = "SELECT c.quantity, p.img, p.name, pr.price FROM cart c INNER JOIN product p ON c.product_id=p.id INNER JOIN price pr ON p.id=pr.product_id WHERE c.user_id = %s;"
        cursor.execute(sql, (user_id,))
        cart_items = cursor.fetchall()

    conn.close()

    if cart_items:
        return jsonify(cart_items)
    else:
        return jsonify({"message": "Cart is empty"}), 404


@app.route("/api/add_to_cart", methods=["POST"])
def add_to_cart():
    product_id = request.headers.get("product_id")
    user_id = request.headers.get("user_id")
    conn = pymysql.connect(**config)

    with conn.cursor() as cursor:
        sql = "INSERT INTO cart(user_id, product_id, quantity) VALUES (%s, %s, 1)"
        cursor.execute(
            sql,
            (
                user_id,
                product_id,
            ),
        )
        result = cursor.fetchone()

    conn.commit()
    conn.close()

    if result:
        return jsonify({"message": "Added to cart"})
    else:
        return jsonify({"message": "Not added to cart"}), 404


if __name__ == "__main__":
    app.run(debug=True, port=8000)
