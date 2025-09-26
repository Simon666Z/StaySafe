import json
import tldextract

# use individual shop APIs


def search_amazon(product_url: str) -> str:
    return ""


def search_shein(product_url: str) -> str:
    return ""


def search_digitec(product_url: str) -> str:
    return ""


def search_galaxus(product_url: str) -> str:
    return ""


def search_etsy(product_url: str) -> str:
    return ""


def search_ebay(product_url: str) -> str:
    return ""


def search_walmart(product_url: str) -> str:
    return ""


def search_ricardo(product_url: str) -> str:
    return ""


# mapping between shop domains and the corresponding function
SHOP_FUNC_MAP = {
    "amazon.com": search_amazon,
    "amazon.co.uk": search_amazon,
    "shein.com": search_shein,
    "digitec.ch": search_digitec,
    "galaxus.ch": search_galaxus,
    "etsy.com": search_etsy,
    "ebay.com": search_ebay,
    "walmart.com": search_walmart,
    "ricardo.ch": search_ricardo,
    # Add more as needed
}


# use webscraping


def search_product(product_url: str) -> str:
    return ""


def extract_domain(url: str) -> str:
    ext = tldextract.extract(url)
    return f"{ext.domain}.{ext.suffix}"


def findProduct(product_url: str):
    domain = extract_domain(product_url)

    if domain in SHOP_FUNC_MAP:
        search_func = SHOP_FUNC_MAP[domain]
        return search_func(product_url)
    else:
        return search_product(product_url)
