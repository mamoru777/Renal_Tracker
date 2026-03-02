package tokensRefreshPkg

const TokensRefreshV0MethodPath = "/api/tokens/refresh"

type TokensRefreshV0Request struct{}

type TokensRefreshV0Response struct {
	AccessToken  string `json:"accessToken"`
	RefreshToken string `json:"refreshToken"`
}
