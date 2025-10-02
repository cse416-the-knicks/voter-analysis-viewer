# $File: Dockerfile
# $Author: Jerry Zhu (jerry.zhu@stonybrook.edu)
# $Date: 10-01-2025 18:00:33
# $Updated: 10-01-2025 19:54:44
# $Description: This is for the "secondary" runner which actually does
#               db init, as an external "user"

FROM postgres:17
RUN apt update && apt install -y python3 \
    python3-pip python3-venv bash
