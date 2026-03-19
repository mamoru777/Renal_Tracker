package gorm

import (
	"context"
	"fmt"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type JoinType string

const (
	INNER_JOIN       JoinType = "inner join"
	JOIN             JoinType = "join"
	LEFT_JOIN        JoinType = "left join"
	RIGHT_JOIN       JoinType = "right join"
	CROSS_JOIN       JoinType = "cross join"
	FULL_JOIN        JoinType = "full_join"
	FULL_OUTER_JOIN  JoinType = "full outer join"
	LEFT_OUTER_JOIN  JoinType = "left outer join"
	RIGHT_OUTER_JOIN JoinType = "right outer join"
)

func NewGorm(dsn string, config *gorm.Config) (*gorm.DB, error) {
	db, err := gorm.Open(postgres.Open(dsn), config)
	if err != nil {
		return nil, err
	}

	return db, nil
}

type txKey struct{}

func InjectTx(ctx context.Context, tx *gorm.DB) context.Context {
	return context.WithValue(ctx, txKey{}, tx)
}

func ExtractTx(ctx context.Context) *gorm.DB {
	if tx, ok := ctx.Value(txKey{}).(*gorm.DB); ok {
		return tx
	}
	return nil
}

func BuildJoin(query *gorm.DB, joinType JoinType, destinationTable, param1, param2 string) *gorm.DB {
	return query.Joins(
		fmt.Sprintf(
			"%s %s ON %s = %s",
			joinType,
			destinationTable,
			param1,
			param2,
		),
	)
}
