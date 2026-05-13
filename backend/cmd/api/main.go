package main

import (
	"context"
	"errors"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/Sugar-27/House_trend/backend/internal/config"
	"github.com/Sugar-27/House_trend/backend/internal/handler"
	"github.com/Sugar-27/House_trend/backend/internal/httpserver"
	"github.com/Sugar-27/House_trend/backend/internal/service"
)

func main() {
	cfg := config.Load()
	logger := slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{Level: cfg.LogLevel()}))

	marketService := service.NewMarketService()
	rateService := service.NewRateService()
	handlers := handler.NewRegistry(cfg, marketService, rateService)
	server := httpserver.New(cfg, logger, handlers)

	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	go func() {
		logger.Info("house trend backend started", "addr", server.Addr)
		if err := server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			logger.Error("server failed", "error", err)
			stop()
		}
	}()

	<-ctx.Done()
	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := server.Shutdown(shutdownCtx); err != nil {
		logger.Error("server shutdown failed", "error", err)
		os.Exit(1)
	}

	logger.Info("house trend backend stopped")
}
