package pointer

func Pointer[T any](val T) *T {
	return &val
}

func ConvertIntPToInt64P(val *int) *int64 {
	if val == nil {
		return nil
	}

	int64Val := int64(*val)

	return &int64Val
}

func ConvertInt64PToIntP(val *int64) *int {
	if val == nil {
		return nil
	}

	int64Val := int(*val)

	return &int64Val
}
