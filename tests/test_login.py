import pytest
from pages.login_page import LoginPage
from pages.dashboard_page import DashboardPage
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


BASE_URL = "http://localhost:3000/LoginPage"   # update if needed

def test_valid_login(driver):
    driver.get(BASE_URL)

    login_page = LoginPage(driver)
    login_page.enter_email("abc@gmail.com")
    login_page.enter_password("abc")
    login_page.click_login()
    alert = WebDriverWait(driver, 5).until(EC.alert_is_present())
    alert_text = alert.text
    alert.accept()  # closes the alert

    assert "Login successful" in alert_text  # optional check


    dashboard = DashboardPage(driver)
    welcome_text = dashboard.get_welcome_text()
    assert "Welcome back" in welcome_text
def test_invalid_login(driver):
    driver.get(BASE_URL)
    login_page = LoginPage(driver)
    login_page.enter_email("wrong@example.com")
    login_page.enter_password("wrongpass")
    login_page.click_login()

    # Handle JavaScript alert
    alert = WebDriverWait(driver, 5).until(EC.alert_is_present())
    alert_text = alert.text
    alert.accept()

    assert "Login failed" in alert_text or "Invalid" in alert_text

