package httpserver

import (
	"encoding/json"
	"net/http"
)

// Envelope keeps API responses predictable for the future BFF layer.
type Envelope struct {
	Data  any       `json:"data,omitempty"`
	Error *APIError `json:"error,omitempty"`
}

// APIError is the public error format returned by API endpoints.
type APIError struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

// WriteJSON writes a JSON response with standard headers.
func WriteJSON(w http.ResponseWriter, statusCode int, data any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(statusCode)
	_ = json.NewEncoder(w).Encode(Envelope{Data: data})
}

// WriteError writes a JSON error response.
func WriteError(w http.ResponseWriter, statusCode int, code string, message string) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(statusCode)
	_ = json.NewEncoder(w).Encode(Envelope{Error: &APIError{Code: code, Message: message}})
}
