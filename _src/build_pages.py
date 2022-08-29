import yaml

TEMPLATE_FILE = "_src/template.html"
CONFIG_FILE = "_src/page_index.yml"
SOURCE_TAG = "<!-- INSERT_CONTENT -->"

def create_page(src_file, template):
    with open(src_file, 'r') as f:
        source = f.read()

    page = template.replace(SOURCE_TAG, source)
    return page


def make_active_opener(page, opener_name):
    tag = "<span class=\"opener\">{}</span>".format(opener_name)
    active_tag = "<span class=\"opener active\">{}</span>".format(opener_name)
    page = page.replace(tag, active_tag)
    return page


# Open configuration file.
with open(CONFIG_FILE, 'r') as f:
    data = yaml.load(f, Loader=yaml.Loader)

# Read template file.
with open(TEMPLATE_FILE, 'r') as f:
    template = f.read()

for key, val in data["pages"].items():
    page = create_page(val["src"], template)
    if "active_opener" in val.keys():
        page = make_active_opener(page, val["active_opener"])

    print("Generating", key, "from", val["src"])
    with open(key, 'w') as f:
        f.write(page)
