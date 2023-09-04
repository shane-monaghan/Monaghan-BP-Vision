from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import base64
import tempfile
import json
import os
import sys
import io

current_dir = os.getcwd()

# Append the relative path to the "bp_research" folder
bp_research_path = os.path.join(current_dir, "..", "bp_research")

sys.path.append(bp_research_path)
# sys.path.pop(-1)
sys.path


from landmark_utils import *
from LandmarkTester import LandmarkTester
from GetLandmarks import GetLandmarks
from ProcessResults import *


def save_registered_users(registered_users):
    with open("registered_users.json", "w") as file:
        json.dump(registered_users, file)


def load_registered_users():
    try:
        with open("registered_users.json", "r") as file:
            return json.load(file)
    except FileNotFoundError:
        return []


# Create app as a flask server
app = Flask(__name__)
CORS(app)


# Default route accepts both 'get' and 'post' operations
# runs home function if no route is specifed
@app.route("/", methods=["GET", "POST"])
def home():
    return render_template("webTest.html")


# Runs multiply function when path is specified to include 'multiply'
@app.route("/multiply", methods=["POST"])
def multiply():
    data = request.json
    num = data.get("num")
    mult = data.get("mult")
    if num is not None:
        num = num["num"] * mult

    response_data = {"num": num}
    return jsonify(response_data)


@app.route("/b64Txt", methods=["Post"])
def b64Txt():
    # print("starting")
    data = request.json
    encoded_txt = data.get("encoded_txt")
    # print(encoded_txt)
    decoded_txt = (base64.b64decode(encoded_txt)).decode("utf-8")
    # print(decoded_txt)
    final = decoded_txt[::-1]
    response_data = {"final": final}
    return jsonify(response_data)


@app.route("/generic_grayscale", methods=["Post"])
def generic_grayscale():
    # print("starting")
    data = request.json
    path = data.get("path")
    original_image = cv2.imread(path)
    gray_image = cv2.cvtColor(original_image, cv2.COLOR_BGR2GRAY)

    _, img_encoded = cv2.imencode(".jpg", gray_image)
    base64_image = base64.b64encode(img_encoded).decode("utf-8")
    response_data = {"base64_image": base64_image}
    return jsonify(response_data)


@app.route("/grayscale", methods=["POST"])
def grayscale():
    # Get the data from the request
    data = request.json
    encoded_image = data.get("encoded_image")

    # Decode retrieved data
    image_bytes = base64.b64decode(encoded_image)

    # Convert to numpy array and then create image matrix in RGB color format
    nparr = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # if the image is not present after decoding, return an error
    if image is None:
        return (
            jsonify({"error": "failed to read image"}),
            500,
        )

    # Convert to black and white
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Re-encode the image and send it back to javaScript
    _, img_encoded = cv2.imencode(".jpg", gray_image)
    base64_image = base64.b64encode(img_encoded).decode("utf-8")
    response_data = {"base64_image": base64_image}
    return jsonify(response_data)


@app.route("/videoGrayscale", methods=["POST"])
def videoGrayscale():
    # Get the data from the request
    data = request.json
    encoded_video = data.get("encoded_video")

    # Decode retrieved data
    video_bytes = base64.b64decode(encoded_video)

    # Convert to numpy array and then create video matrix in RGB color format
    # nparr = np.frombuffer(video_bytes, np.uint8)
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mov") as temp_file:
        temp_file.write(video_bytes)
        temp_file_name = temp_file.name

    cap = cv2.VideoCapture(temp_file_name)
    frame_width = int(cap.get(3))
    frame_height = int(cap.get(4))
    frame_size = (frame_width, frame_height)
    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    output = cv2.VideoWriter("temp.mov", fourcc, 20, frame_size, isColor=False)

    while True:
        ret, frame = cap.read()
        if not ret:
            break
        gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        output.write(gray_frame)
        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

    cap.release()
    output.release()

    return "done"


@app.route("/login", methods=["POST"])
def login():
    registered_users = load_registered_users()
    data = request.json
    username = data.get("username")
    password = data.get("password")

    user = next(
        (
            user
            for user in registered_users
            if user["username"] == username and user["password"] == password
        ),
        None,
    )

    if user:
        return jsonify({"success": True, "message": "Login successful"})
    else:
        return jsonify({"success": False, "message": "Invalid username or password"})


@app.route("/register", methods=["POST"])
def register():
    registered_users = load_registered_users()
    data = request.json
    username = data.get("username")
    password = data.get("password")

    if any(user["username"] == username for user in registered_users):
        return jsonify({"success": False, "message": "Username already exists"})

    registered_users.append({"username": username, "password": password})
    save_registered_users(registered_users)

    return jsonify({"success": True, "message": "Registration successful"})


@app.route("/getData", methods=["POST"])
def getData():
    data = request.json
    encoded_image = data.get("encoded_image")

    image_bytes = base64.b64decode(encoded_image)

    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    lmk = GetLandmarks(img)

    results = ProcessResults(lmk)

    results.compute_distances()
    results.compute_features()

    dists = results._dists
    features = results._features

    def convert_to_string(value):
        if isinstance(value, np.float32):
            return str(value)
        return value

    dists = {k: convert_to_string(v) for k, v in dists.items()}
    features = {k: convert_to_string(v) for k, v in features.items()}

    response_data = {"dists": dists, "features": features}

    return json.dumps(response_data)


def vid_landmarks(
    img, og_landmarks, figsize=(4, 3), title="Image", show_ticks=False, **kwargs
):
    fig, ax = plt.subplots(1, 1, figsize=figsize)
    ax.imshow(img, **kwargs)

    og_points = np.transpose(og_landmarks)
    ax.scatter(
        x=og_points[0], y=og_points[1], c="#42ff55", s=20, alpha=1, edgecolor="none"
    )

    ax.axis("off")  # Remove axis ticks and labels
    ax.set_title("")  # Remove the title

    fig.tight_layout()

    # Convert the figure to a NumPy array in BGR format
    buf = io.BytesIO()
    fig.canvas.print_png(buf)
    buf.seek(0)
    image = np.array(Image.open(buf))
    image_bgr = cv2.cvtColor(image, cv2.COLOR_RGBA2BGR)

    plt.close(fig)  # Close the figure to free up memory

    return image_bgr


def vis_landmarks(
    img, og_landmarks, figsize=(4, 3), title="Image", show_ticks=False, **kwargs
):
    fig, ax = plt.subplots(1, 1, figsize=figsize)
    ax.imshow(img, **kwargs)

    og_points = np.transpose(og_landmarks)
    ax.scatter(
        x=og_points[0], y=og_points[1], c="#42ff55", s=20, alpha=1, edgecolor="none"
    )

    ax.axis("off")  # Remove axis ticks and labels
    ax.set_title("")  # Remove the title

    fig.tight_layout()

    # Save the figure to a byte stream
    buf = io.BytesIO()
    fig.savefig(buf, format="png", transparent=True)
    buf.seek(0)

    # Convert the byte stream to base64
    image_base64 = base64.b64encode(buf.getvalue()).decode("utf-8")

    plt.close(fig)  # Close the figure to free up memory

    return image_base64


@app.route("/plotVideo", methods=["POST"])
def plotVideo():
    data = request.json
    encoded_video = data.get("encoded_video")

    video_bytes = base64.b64decode(encoded_video)

    with tempfile.NamedTemporaryFile(delete=False, suffix=".mov") as temp_file:
        temp_file.write(video_bytes)
        temp_file_name = temp_file.name

    cap = cv2.VideoCapture(temp_file_name)
    frame_width = int(cap.get(3))
    frame_height = int(cap.get(4))
    frame_size = (frame_height, frame_width)
    fps = 20
    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    output = cv2.VideoWriter("plottedVid.mov", fourcc, fps, frame_size)

    x = 0
    while True:
        x = x + 1
        ret, frame = cap.read()
        if not ret:
            break

    cap.release()
    cap = cv2.VideoCapture(temp_file_name)

    i = 0
    while True:
        i = i + 1
        print("Frame: " + str(i) + "/" + str(x))
        ret, frame = cap.read()
        if not ret:
            break
        lmkT = LandmarkTester(frame)
        new_frame = vid_landmarks(np.flip(frame, -1), lmkT._og_landmarks)
        resized_frame = cv2.resize(new_frame, frame_size)
        output.write(resized_frame)
        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

    cap.release()
    output.release()

    return "done"


@app.route("/plotPoints", methods=["POST"])
def plotPoints():
    data = request.json
    encoded_image = data.get("encoded_image")

    image_bytes = base64.b64decode(encoded_image)

    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    lmkT = LandmarkTester(img)

    base64_image = vis_landmarks(np.flip(img, -1), lmkT._og_landmarks)

    response_data = {"base64_image": base64_image}
    return jsonify(response_data)


if __name__ == "__main__":
    load_registered_users()
    app.run(debug=True)
