from flask import Flask, jsonify, request
from flask_cors import CORS
import pymysql, jwt
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
        sql = "SELECT * FROM product WHERE ID = %s"
        cursor.execute(sql, (product_id,))
        product = cursor.fetchone()

    conn.close()
    if product:
        data = {
            "name": product["name"],
            "description": product["description"],
            "img": product["img"],
            "id": product["id"],
        }
        return jsonify(data)
    else:
        return jsonify({"message": "Product not found"}), 404


@app.route("/api/all_products")
def all_products():
    conn = pymysql.connect(**config)

    with conn.cursor() as cursor:
        sql = "SELECT * FROM product"
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
            "id": user["id"],
            "username": user["username"],
            "email": user["email"],
        }
        # Generate JWT
        access_token = generate_jwt(user_data)

        return jsonify({"message": "Login successful", "access_token": access_token})

    return jsonify({"message": "Invalid credentials"}), 401


if __name__ == "__main__":
    app.run(debug=True, port=8000)
