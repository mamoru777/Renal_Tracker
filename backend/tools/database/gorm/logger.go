package gorm

import (
	"context"
	"fmt"
	"time"

	"gorm.io/gorm/logger"

	"github.com/rs/zerolog/log"
)

// Colors
const (
	Reset       = "\033[0m"
	Red         = "\033[31m"
	Green       = "\033[32m"
	Yellow      = "\033[33m"
	Blue        = "\033[34m"
	Magenta     = "\033[35m"
	Cyan        = "\033[36m"
	White       = "\033[37m"
	BlueBold    = "\033[34;1m"
	MagentaBold = "\033[35;1m"
	RedBold     = "\033[31;1m"
	YellowBold  = "\033[33;1m"
)

const (
	TraceTypeError = "[ERROR]"
	TraceTypeDebug = "[DEBUG]"
)

type (
	Logger interface {
		LogMode(logLevel logger.LogLevel) logger.Interface
		Info(context.Context, string, ...interface{})
		Warn(context.Context, string, ...interface{})
		Error(context.Context, string, ...interface{})
		Trace(ctx context.Context, begin time.Time, fc func() (sql string, rowsAffected int64), err error)
	}

	loggerGorm struct {
		LogLevel      logger.LogLevel
		isTrace       bool
		traceErrStr   string
		traceDebugStr string
	}
)

func NewLogger(isTrace bool) Logger {
	return &loggerGorm{
		LogLevel:      logger.Info,
		isTrace:       isTrace,
		traceErrStr:   RedBold + "%s" + Green + "%s " + MagentaBold + "[rows:%v]" + Reset + BlueBold + "[elapsed:%f ms]" + Reset,
		traceDebugStr: YellowBold + "%s" + Green + "%s " + MagentaBold + "[rows:%v]" + Reset + BlueBold + "[elapsed:%f ms]" + Reset,
	}
}

func (l loggerGorm) LogMode(logLevel logger.LogLevel) logger.Interface {
	newlogger := l
	newlogger.LogLevel = logLevel
	return &newlogger
}

func (l loggerGorm) Info(_ context.Context, s string, i ...interface{}) {
	log.Info().Msg(s)
}

func (l loggerGorm) Warn(_ context.Context, s string, i ...interface{}) {
	log.Warn().Msg(s)
}

func (l loggerGorm) Error(_ context.Context, s string, i ...interface{}) {
	log.Error().Msg(s)
}

func (l loggerGorm) Trace(_ context.Context, begin time.Time, fc func() (sql string, rowsAffected int64), err error) {
	if !l.isTrace {
		return
	}

	elapsed := time.Since(begin)

	sql, rows := fc()

	if err != nil {
		log.Info().Msg(fmt.Sprintf(l.traceErrStr, TraceTypeError, sql, rows, float64(elapsed.Nanoseconds())/1e6))
	} else {
		log.Info().Msg(fmt.Sprintf(l.traceDebugStr, TraceTypeDebug, sql, rows, float64(elapsed.Nanoseconds())/1e6))
	}
}
