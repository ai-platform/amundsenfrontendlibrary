from typing import Any, Tuple

from flask import Flask, render_template, send_from_directory
import os

ENVIRONMENT = os.getenv('APPLICATION_ENV', 'development')


def init_routes(app: Flask) -> None:
    static_rule = get_static_rule(os.path.join(app.root_path, 'explore', 'static'))
    app.add_url_rule('/healthcheck', 'healthcheck', healthcheck)
    app.add_url_rule('/explore/static/<path:filename>', 'static_explore', static_rule)  # static files
    app.add_url_rule('/explore/', 'index', index, defaults={'path': ''})  # also functions as catch_all


def index(path: str) -> Any:
    return render_template("index.html", env=ENVIRONMENT)  # pragma: no cover


def get_static_rule(path: str) -> Any:
    def static_rule(filename: str) -> Any:
        return send_from_directory(path, filename)  # pragma: no cover
    return static_rule


def healthcheck() -> Tuple[str, int]:
    return '', 200  # pragma: no cover
