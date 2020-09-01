FROM node:12-slim as node-stage
WORKDIR /app/amundsen_application/explore/static

COPY amundsen_application/explore/static/package.json /app/amundsen_application/explore/static/package.json
COPY amundsen_application/explore/static/package-lock.json /app/amundsen_application/explore/static/package-lock.json
RUN npm install

COPY amundsen_application/explore/static /app/amundsen_application/explore/static
RUN npm run build

FROM python:3.7-slim as base
WORKDIR /app
RUN pip3 install gunicorn

COPY requirements.txt /app/requirements.txt
RUN pip3 install -r requirements.txt

COPY --from=node-stage /app /app
COPY . /app
RUN python3 setup.py install

CMD [ "python3",  "amundsen_application/wsgi.py" ]

FROM base as oidc-release

RUN pip3 install .[oidc]
ENV FRONTEND_SVC_CONFIG_MODULE_CLASS amundsen_application.oidc_config.OidcConfig
ENV APP_WRAPPER flaskoidc
ENV APP_WRAPPER_CLASS FlaskOIDC
ENV FLASK_OIDC_WHITELISTED_ENDPOINTS status,healthcheck,health
ENV FLASK_OIDC_SQLALCHEMY_DATABASE_URI sqlite:///sessions.db

# You will need to set these environment variables in order to use the oidc image
# FLASK_OIDC_CLIENT_SECRETS - a path to a client_secrets.json file
# FLASK_OIDC_SECRET_KEY - A secret key from your oidc provider
# You will also need to mount a volume for the clients_secrets.json file.

FROM base as release
