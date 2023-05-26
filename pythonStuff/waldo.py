import cv2
import numpy as np


def find_waldo(image_path, template_path):
    # Load the image and template
    image = image_path
    template = cv2.imread(template_path, cv2.IMREAD_GRAYSCALE)

    # Perform template matching
    result = cv2.matchTemplate(image, template, cv2.TM_CCOEFF_NORMED)
    _, _, _, max_loc = cv2.minMaxLoc(result)

    # Get the dimensions of the template
    template_height, template_width = template.shape[:2]

    # Draw a rectangle around the matched area
    top_left = max_loc
    bottom_right = (top_left[0] + template_width, top_left[1] + template_height)
    cv2.rectangle(image, top_left, bottom_right, (0, 0, 255), 2)

    # Display the highlighted image
    cv2.imshow("Where's Waldo?", image)
    cv2.waitKey(0)
    cv2.destroyAllWindows()


# # Example usage
# image_path = 'waldo_image.jpg'  # Replace with the actual path to your image
# template_path = 'waldo.png'  # Replace with the actual path to the template
# find_waldo(image_path, template_path)
