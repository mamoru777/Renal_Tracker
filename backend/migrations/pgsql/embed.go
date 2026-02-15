package pgsqlMigraions

import (
	"embed"
)

//go:embed *.sql
var EmbedMigrationsPgsql embed.FS
