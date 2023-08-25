from flask import Flask, jsonify, request
from flask_cors import CORS
import pymysql, jwt
from jwt import encode
from datetime import datetime, timedelta
from pymysql.err import Error

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
        print(product)
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
        sql = "SELECT u.*, a.is_admin FROM user u INNER JOIN admin a ON u.id=a.user_id WHERE u.email = %s AND u.password = %s"
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
            "is_admin": user["is_admin"],
        }
        # Generate JWT
        access_token = generate_jwt(user_data)

        return jsonify(
            {
                "message": "Login successful",
                "access_token": access_token,
                "user_id": user_data["user_id"],
                "is_admin": user_data["is_admin"],
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
        sql = "SELECT c.quantity, p.img, p.name, p.id, pr.price FROM cart c INNER JOIN product p ON c.product_id=p.id INNER JOIN price pr ON p.id=pr.product_id WHERE c.user_id = %s;"
        cursor.execute(sql, (user_id,))
        cart_items = cursor.fetchall()

    conn.close()

    if cart_items:
        return jsonify(cart_items)
    else:
        return jsonify({"message": "Cart is empty"}), 404


@app.route("/api/add_to_cart", methods=["POST"])
def add_to_cart():
    try:
        data = request.json  # Get data from the request body
        product_id_str = data.get("product_id")
        user_id_str = data.get("user_id")

        if product_id_str is None or user_id_str is None:
            return jsonify({"message": "Missing data"}), 400

        product_id = int(product_id_str)
        user_id = int(user_id_str)
    except (ValueError, TypeError):
        return jsonify({"message": "Invalid data"}), 400

    conn = pymysql.connect(**config)

    with conn.cursor() as cursor:
        sql = "select * from cart where user_id = %s and product_id = %s"
        cursor.execute(
            sql,
            (
                user_id,
                product_id,
            ),
        )
        result = cursor.fetchone()
        print(result)

        if result:
            temp_quantity = result["quantity"]
            new_quantity = temp_quantity + 1
            sql = "update cart set quantity = %s where product_id = %s and user_id = %s"
            cursor.execute(
                sql,
                (
                    new_quantity,
                    product_id,
                    user_id,
                ),
            )

            conn.commit()
            conn.close()

            return jsonify({"message": "Added to cart"})
        else:
            with conn.cursor() as cursor:
                sql = (
                    "INSERT INTO cart(user_id, product_id, quantity) VALUES (%s, %s, 1)"
                )
                cursor.execute(
                    sql,
                    (
                        user_id,
                        product_id,
                    ),
                )

            conn.commit()
            conn.close()

            if cursor.rowcount > 0:
                return jsonify({"message": "Added to cart"})
            else:
                return jsonify({"message": "Not added to cart"}), 404


@app.route("/api/carousel_products", methods=["GET"])
def carousel_products():
    conn = pymysql.connect(**config)

    with conn.cursor() as cursor:
        sql = "SELECT p.id, p.name, p.img, pr.price FROM product p INNER JOIN price pr ON p.id=pr.product_id ORDER BY RAND() LIMIT 10"
        cursor.execute(sql)
        products = cursor.fetchall()

    conn.close()

    if products:
        return jsonify(products)
    else:
        return jsonify({"message": "No products found"}), 404


@app.route("/api/remove_item", methods=["POST"])
def remove_item():
    try:
        data = request.json  # Get data from the request body
        product_id_str = data.get("product_id")
        user_id_str = data.get("user_id")

        if product_id_str is None or user_id_str is None:
            return jsonify({"message": "Missing data"}), 400

        product_id = int(product_id_str)
        user_id = int(user_id_str)

        conn = pymysql.connect(**config)

        try:
            with conn.cursor() as cursor:
                sql = "DELETE FROM cart WHERE product_id = %s AND user_id = %s"
                cursor.execute(sql, (product_id, user_id))
                conn.commit()

                if cursor.rowcount > 0:
                    return jsonify({"message": "Removed from cart"}), 200
                else:
                    return jsonify({"message": "Failed to remove from cart"}), 404

        except pymysql.Error as e:
            # Handle SQL errors
            return jsonify({"message": "Database error"}), 500

        finally:
            conn.close()

    except (ValueError, TypeError):
        return jsonify({"message": "Invalid data"}), 400


@app.route("/api/remove_one", methods=["POST"])
def remove_one():
    try:
        data = request.json  # Get data from the request body
        product_id_str = data.get("product_id")
        user_id_str = data.get("user_id")

        if product_id_str is None or user_id_str is None:
            return jsonify({"message": "Missing data"}), 400

        product_id = int(product_id_str)
        user_id = int(user_id_str)

        conn = pymysql.connect(**config)

        try:
            with conn.cursor() as cursor:
                # Check if the item exists in the cart
                check_sql = (
                    "SELECT quantity FROM cart WHERE product_id = %s AND user_id = %s"
                )
                cursor.execute(check_sql, (product_id, user_id))
                result = cursor.fetchone()

                if result is None:
                    return jsonify({"message": "Item not found in cart"}), 404

                # Update the quantity by subtracting 1
                current_quantity = result["quantity"]
                if current_quantity > 1:
                    new_quantity = current_quantity - 1
                    update_sql = "UPDATE cart SET quantity = %s WHERE product_id = %s AND user_id = %s"
                    cursor.execute(update_sql, (new_quantity, product_id, user_id))
                    conn.commit()
                    return jsonify({"message": "Removed one item"}), 200
                else:
                    delete_sql = (
                        "DELETE FROM cart WHERE product_id = %s AND user_id = %s"
                    )
                    cursor.execute(delete_sql, (product_id, user_id))
                    conn.commit()
                    return jsonify({"message": "Item removed from cart"}), 200

        except Error as e:
            # Handle SQL errors
            return jsonify({"message": "Database error"}), 500

        finally:
            conn.close()

    except (ValueError, TypeError):
        return jsonify({"message": "Invalid data"}), 400


@app.route("/api/categories", methods=["GET"])
def get_categories():
    conn = pymysql.connect(**config)
    with conn.cursor() as cursor:
        sql = "SELECT name FROM categories"
        cursor.execute(sql)
        categories = cursor.fetchall()
    conn.close()
    return jsonify(categories)


@app.route("/api/add_product", methods=["POST"])
def add_product():
    data = request.json
    name = data.get("name")
    description = data.get("description")
    img = data.get("img")
    price = data.get("price")

    conn = pymysql.connect(**config)

    try:
        with conn.cursor() as cursor:
            # Call the add_product stored procedure
            cursor.callproc("add_product", (name, description, img, price))
        conn.commit()

        return jsonify({"message": "Product added successfully"})
    except Exception as e:
        print("Error:", e)
        conn.rollback()
        return jsonify({"message": "Failed to add product"}), 500
    finally:
        conn.close()


@app.route("/api/delete_product", methods=["POST"])
def delete_product():
    data = request.json
    product_id = data.get("product_id")

    conn = pymysql.connect(**config)

    try:
        with conn.cursor() as cursor:
            cursor.callproc("delete_product", (product_id,))
        conn.commit()

        return jsonify({"message": "Product deleted successfully"})
    except Exception as e:
        print("Error:", e)
        conn.rollback()
        return jsonify({"message": "Failed to delete product"}), 500
    finally:
        conn.close()


if __name__ == "__main__":
    app.run(debug=True, port=8000)
