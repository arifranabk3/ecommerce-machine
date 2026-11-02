# Sellzy — Country Provider Coverage Matrix

| Country Code | Country Name | Flag | Configured Provider | Supported Filters | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **US** | United States | 🇺🇸 | US Commercial State Registry & Chamber Provider | State, City, Industry, Business Name | **Active / Supported** |
| **GB** | United Kingdom | 🇬🇧 | UK Official Companies Registry & Trade Directory | City, Industry, Business Name | **Active / Supported** |
| **CA** | Canada | 🇨🇦 | Corporations Canada Business Registry | State/Province, City, Industry | **Active / Supported** |
| **AU** | Australia | 🇦🇺 | Australian Business Register (ABR) & ASIC | State, City, Industry | **Active / Supported** |
| **DE** | Germany | 🇩🇪 | German Commercial Register (Handelsregister) | City, Industry | **Active / Supported** |
| **FR** | France | 🇫🇷 | None Configured | None | **Unsupported (Returns Real Error)** |
| **IN** | India | 🇮🇳 | None Configured | None | **Unsupported (Returns Real Error)** |
| **AE** | United Arab Emirates | 🇦🇪 | None Configured | None | **Unsupported (Returns Real Error)** |
| **JP** | Japan | 🇯🇵 | None Configured | None | **Unsupported (Returns Real Error)** |

### Strict Fallback Policy
When an unsupported country is requested, the system returns:  
`"No configured data provider supports this country."` with job status `FAILED`. Under no circumstances are fake records generated or another country silently substituted.

