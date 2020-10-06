openssl req -nodes -x509 -newkey rsa:2048 -keyout key.private
openssl rsa -in key.private -pubout > key.public
