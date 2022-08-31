import yaml

TEMPLATE_FILE = "_src/template.html"
CONFIG_FILE = "_src/page_index.yml"
SOURCE_TAG = "<!-- INSERT_CONTENT -->"


def create_page(src_file, template):
    with open(src_file, 'r', encoding='utf-8') as f:
        source = f.read()

    page = template.replace(SOURCE_TAG, source)
    return page


def make_active_opener(page, opener_name):
    tag = "<span class=\"opener\">{}</span>".format(opener_name)
    active_tag = "<span class=\"opener active\">{}</span>".format(opener_name)
    page = page.replace(tag, active_tag)
    return page


def set_title(page, title):
    empty_title = "<title>PAGE_TITLE</title>"
    page = page.replace(empty_title, "<title>{}</title>".format(title))
    return page


def convert_windows_to_unix(file):
    WINDOWS_LINE_ENDING = b'\r\n'
    UNIX_LINE_ENDING = b'\n'

    with open(file, 'rb') as f:
        content = f.read()

    # Convert Windows line endings to Unix.
    content = content.replace(WINDOWS_LINE_ENDING, UNIX_LINE_ENDING)

    # Save the file.
    with open(file, 'wb') as f:
        f.write(content)


# Open configuration file.
with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
    data = yaml.load(f, Loader=yaml.Loader)

# Read template file.
with open(TEMPLATE_FILE, 'r', encoding='utf-8') as f:
    template = f.read()

for key, val in data["pages"].items():
    page = create_page(val["src"], template)
    # Set title.
    page = set_title(page, val["title"])
    if "active_opener" in val.keys():
        page = make_active_opener(page, val["active_opener"])

    print("Generating", key, "from", val["src"])
    with open(key, 'w', encoding='utf-8') as f:
        f.write(page)

    convert_windows_to_unix(key)
