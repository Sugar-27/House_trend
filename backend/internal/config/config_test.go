package config

import "testing"

func TestLoadUsesSafeDefaults(t *testing.T) {
	t.Setenv("HOUSE_TREND_API_PORT", "")
	t.Setenv("HOUSE_TREND_ENV", "")
	t.Setenv("HOUSE_TREND_ALLOWED_ORIGINS", "")
	t.Setenv("HOUSE_TREND_RATE_LIMIT_REQUESTS", "")

	cfg := Load()

	if cfg.Port != defaultPort {
		t.Fatalf("expected default port %q, got %q", defaultPort, cfg.Port)
	}
	if cfg.Environment != defaultEnvironment {
		t.Fatalf("expected default environment %q, got %q", defaultEnvironment, cfg.Environment)
	}
	if cfg.Address() != ":8080" {
		t.Fatalf("expected address :8080, got %q", cfg.Address())
	}
	if len(cfg.AllowedOrigins) != 1 || cfg.AllowedOrigins[0] != "http://localhost:3000" {
		t.Fatalf("unexpected allowed origins: %#v", cfg.AllowedOrigins)
	}
	if cfg.RateLimitRequests != defaultRateLimitRequests {
		t.Fatalf("expected default rate limit %d, got %d", defaultRateLimitRequests, cfg.RateLimitRequests)
	}
}

func TestLoadReadsEnvironmentOverrides(t *testing.T) {
	t.Setenv("HOUSE_TREND_API_PORT", "9090")
	t.Setenv("HOUSE_TREND_ENV", "production")
	t.Setenv("HOUSE_TREND_ALLOWED_ORIGINS", "https://example.com, http://localhost:3000")
	t.Setenv("HOUSE_TREND_RATE_LIMIT_REQUESTS", "42")

	cfg := Load()

	if cfg.Port != "9090" {
		t.Fatalf("expected overridden port, got %q", cfg.Port)
	}
	if cfg.Environment != "production" {
		t.Fatalf("expected production environment, got %q", cfg.Environment)
	}
	if len(cfg.AllowedOrigins) != 2 {
		t.Fatalf("expected two allowed origins, got %#v", cfg.AllowedOrigins)
	}
	if cfg.RateLimitRequests != 42 {
		t.Fatalf("expected overridden rate limit, got %d", cfg.RateLimitRequests)
	}
}
