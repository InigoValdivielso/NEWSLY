from fastapi import APIRouter, Request
from main import oauth
from authlib.integrations.starlette_client import OAuthError


google = APIRouter()


@google.get("/login_google")
def google_login(request: Request):
    url = request.url_for("auth_google")
    return oauth.google.authorize_redirect(request, url)

@google.get("/auth_google")
def google_auth(request: Request):
    try:
        token = oauth.google.authorize_access_token(request)
    except OAuthError as e:
        return e
    user = token.get("userinfo")
    if user:
        request.session["user"] = dict(user)
    return