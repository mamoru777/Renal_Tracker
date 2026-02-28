package gfrUsecase

func GetGfrNorms(age uint8) (uint8, uint8, uint8) {
	if age >= 20 && age < 30 {
		return 110, 120, 90
	}

	if age >= 30 && age < 40 {
		return 100, 110, 90
	}

	if age >= 40 && age < 50 {
		return 90, 100, 90
	}

	if age >= 50 && age < 60 {
		return 80, 95, 60
	}

	if age >= 60 && age < 70 {
		return 70, 85, 60
	}

	if age >= 70 {
		return 60, 75, 60
	}

	return 0, 0, 0
}
