import http.server
import socketserver
import os

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Content-Type', self.guess_type(self.path) + '; charset=utf-8')
        super().end_headers()

PORT = 8081
Handler = CustomHTTPRequestHandler

os.chdir('.')
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Server running at http://localhost:{PORT}/")
    httpd.serve_forever()
