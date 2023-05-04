import re, os, sys, json

def string_to_url_handle(word, splitter):
    result = re.sub(splitter, " ", word).strip().lower()
    return re.sub(" ", "-", result)

def generate_card_categories(image_folder_path):
    categories = []
    for filename in os.listdir(image_folder_path):
        filepath = os.path.join(image_folder_path, filename)
        if os.path.isfile(filepath) and not filename.startswith('.'): # ignore hidden files
            category_name = filename.split(".")[0].split("-")[-1];
            categories.append({ "name": category_name, "icon": filename })
    return categories

def generate_cards(image_folder_path):
    cards = []
    for filename in os.listdir(image_folder_path):
        filepath = os.path.join(image_folder_path, filename)
        if os.path.isfile(filepath) and not filename.startswith('.'): # ignore hidden files
            filename_chunks = filename.split("-")
            card_category = filename_chunks[0].lower()
            card_handle = string_to_url_handle(filename_chunks[1], "_")
            cards.append({ "category": card_category, "handle": card_handle, "image": filename })
    return cards

if __name__ == '__main__':
    if(len(sys.argv) < 3):
        print("Insufficent number of arguments. Expected: image folder and json file paths.")
        sys.exit()
    images_folder = sys.argv[1]

    card_data = {}
    card_data["categories"] = generate_card_categories(os.path.join(images_folder, "icons"))
    card_data["cards"] = generate_cards(os.path.join(images_folder, "cards"))

    # Save data to JSON file
    json_file_path = os.path.join(sys.argv[2], "storyteller_tactics.json")
    with open(json_file_path, 'w') as f:
        json.dump(card_data, f)
