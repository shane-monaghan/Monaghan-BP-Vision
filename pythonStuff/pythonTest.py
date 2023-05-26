from flask import Flask, render_template, request, jsonify
from waldo import find_waldo

# Route for handling the login page logic
app = Flask(__name__)


@app.route("/", methods=["GET", "POST"])
def home():
    if request.method == "POST":
        selected_image = request.json.get("selectedImage")
        return find_waldo(selected_image, "waldo.png")

        # return jsonify(message="received")
    else:
        return render_template("webTest.html")
