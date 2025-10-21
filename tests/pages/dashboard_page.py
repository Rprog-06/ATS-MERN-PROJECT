from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class DashboardPage:
    def __init__(self, driver):
        self.driver = driver
        self.welcome_banner = (By.XPATH, "//h1[contains(text(), 'Welcome back')]")

    def get_welcome_text(self):
        element = WebDriverWait(self.driver, 10).until(
            EC.visibility_of_element_located(self.welcome_banner)
        )
        return element.text
