from flask import Flask, jsonify
from flask_cors import CORS
import pymysql

app = Flask(__name__)
CORS(app)

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
        }
        return jsonify(data)
    else:
        return jsonify({"message": "Product not found"}), 404


if __name__ == "__main__":
    app.run(debug=True, port=8000)
