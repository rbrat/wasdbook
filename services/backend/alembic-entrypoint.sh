#!/bin/bash

cd src && alembic upgrade head || { echo -e '\033[31m alembic upgrade failed \033[0m' ; exit 1; }