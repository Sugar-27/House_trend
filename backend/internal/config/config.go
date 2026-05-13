package config

import (
	"log/slog"
	"os"
	"strconv"
	"strings"
	"time"
)

const (
	defaultPort              = "8080"
	defaultEnvironment       = "development"
	defaultReadHeaderTimeout = 5 * time.Second
	defaultShutdownTimeout   = 10 * time.Second
	defaultRateLimitWindow   = time.Minute
	defaultRateLimitRequests = 120
)

// Config contains runtime settings for the Go backend service.
type Config struct {
	Port              string
	Environment       string
	AllowedOrigins    []string
	ReadHeaderTimeout time.Duration
	ShutdownTimeout   time.Duration
	RateLimitWindow   time.Duration
	RateLimitRequests int
}

// Load reads environment variables and returns a safe default configuration.
func Load() Config {
	return Config{
		Port:              getEnv("HOUSE_TREND_API_PORT", defaultPort),
		Environment:       getEnv("HOUSE_TREND_ENV", defaultEnvironment),
		AllowedOrigins:    getCSVEnv("HOUSE_TREND_ALLOWED_ORIGINS", []string{"http://localhost:3000"}),
		ReadHeaderTimeout: getDurationEnv("HOUSE_TREND_READ_HEADER_TIMEOUT", defaultReadHeaderTimeout),
		ShutdownTimeout:   getDurationEnv("HOUSE_TREND_SHUTDOWN_TIMEOUT", defaultShutdownTimeout),
		RateLimitWindow:   getDurationEnv("HOUSE_TREND_RATE_LIMIT_WINDOW", defaultRateLimitWindow),
		RateLimitRequests: getIntEnv("HOUSE_TREND_RATE_LIMIT_REQUESTS", defaultRateLimitRequests),
	}
}

// Address returns the HTTP listen address.
func (c Config) Address() string {
	return ":" + c.Port
}

// LogLevel maps the environment to a structured log level.
func (c Config) LogLevel() slog.Level {
	if strings.EqualFold(c.Environment, "production") {
		return slog.LevelInfo
	}

	return slog.LevelDebug
}

func getEnv(key string, fallback string) string {
	if value := strings.TrimSpace(os.Getenv(key)); value != "" {
		return value
	}

	return fallback
}

func getCSVEnv(key string, fallback []string) []string {
	value := strings.TrimSpace(os.Getenv(key))
	if value == "" {
		return fallback
	}

	items := strings.Split(value, ",")
	result := make([]string, 0, len(items))
	for _, item := range items {
		trimmed := strings.TrimSpace(item)
		if trimmed != "" {
			result = append(result, trimmed)
		}
	}

	if len(result) == 0 {
		return fallback
	}

	return result
}

func getDurationEnv(key string, fallback time.Duration) time.Duration {
	value := strings.TrimSpace(os.Getenv(key))
	if value == "" {
		return fallback
	}

	duration, err := time.ParseDuration(value)
	if err != nil {
		return fallback
	}

	return duration
}

func getIntEnv(key string, fallback int) int {
	value := strings.TrimSpace(os.Getenv(key))
	if value == "" {
		return fallback
	}

	number, err := strconv.Atoi(value)
	if err != nil || number <= 0 {
		return fallback
	}

	return number
}
