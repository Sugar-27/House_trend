package collector

import "context"

// Source is the extension point for future external data collection adapters.
type Source interface {
	Name() string
	Collect(ctx context.Context) error
}

// Scheduler describes the contract for future cron-based collection jobs.
type Scheduler interface {
	Register(source Source) error
	Run(ctx context.Context) error
}
