import { Console, fetch, Storage } from "@nsnanocat/util";
import MD5 from "crypto-js/md5.js";

export default class Translate {
	constructor(options = {}) {
		this.Name = "Translate";
		this.Version = "1.0.7";
		Console.log(`🟧 ${this.Name} v${this.Version}`);
		this.Source = "AUTO";
		this.Target = "ZH";
		this.API = {};
		Object.assign(this, options);
	}

	#LanguagesCode = {
		Google: {
			AUTO: "auto",
			AF: "af",
			AM: "am",
			AR: "ar",
			AS: "as",
			AY: "ay",
			AZ: "az",
			BG: "bg",
			BE: "be",
			BM: "bm",
			BN: "bn",
			BHO: "bho",
			CS: "cs",
			DA: "da",
			DE: "de",
			EL: "el",
			EU: "eu",
			EN: "en",
			"EN-GB": "en",
			"EN-US": "en",
			"EN-US SDH": "en",
			ES: "es",
			"ES-419": "es",
			"ES-ES": "es",
			ET: "et",
			FI: "fi",
			FR: "fr",
			"FR-CA": "fr",
			HU: "hu",
			ID: "id",
			IS: "is",
			IT: "it",
			JA: "ja",
			KM: "km",
			KO: "ko",
			LT: "lt",
			LV: "lv",
			NL: "nl",
			NO: "no",
			PL: "pl",
			PT: "pt",
			"PT-PT": "pt",
			"PT-BR": "pt",
			PA: "pa",
			RO: "ro",
			RU: "ru",
			SK: "sk",
			SL: "sl",
			SQ: "sq",
			ST: "st",
			SV: "sv",
			TH: "th",
			TR: "tr",
			UK: "uk",
			UR: "ur",
			VI: "vi",
			ZH: "zh",
			"ZH-HANS": "zh-CN",
			"ZH-HK": "zh-TW",
			"ZH-HANT": "zh-TW",
		},
		Microsoft: {
			AUTO: "",
			AF: "af",
			AM: "am",
			AR: "ar",
			AS: "as",
			AY: "ay",
			AZ: "az",
			BG: "bg",
			BE: "be",
			BM: "bm",
			BN: "bn",
			BHO: "bho",
			CS: "cs",
			DA: "da",
			DE: "de",
			EL: "el",
			EU: "eu",
			EN: "en",
			"EN-GB": "en",
			"EN-US": "en",
			"EN-US SDH": "en",
			ES: "es",
			"ES-419": "es",
			"ES-ES": "es",
			ET: "et",
			FI: "fi",
			FR: "fr",
			"FR-CA": "fr-ca",
			HU: "hu",
			ID: "id",
			IS: "is",
			IT: "it",
			JA: "ja",
			KM: "km",
			KO: "ko",
			LT: "lt",
			LV: "lv",
			NL: "nl",
			NO: "no",
			PL: "pl",
			PT: "pt",
			"PT-PT": "pt-pt",
			"PT-BR": "pt",
			PA: "pa",
			RO: "ro",
			RU: "ru",
			SK: "sk",
			SL: "sl",
			SQ: "sq",
			ST: "st",
			SV: "sv",
			TH: "th",
			TR: "tr",
			UK: "uk",
			UR: "ur",
			VI: "vi",
			ZH: "zh-Hans",
			"ZH-HANS": "zh-Hans",
			"ZH-HK": "yue",
			"ZH-HANT": "zh-Hant",
		},
		DeepL: { AUTO: "", BG: "BG", CS: "CS", DA: "DA", DE: "de", EL: "el", EN: "EN", ES: "ES", ET: "ET", FI: "FI", FR: "FR", HU: "HU", ID: "ID", IT: "IT", JA: "JA", KO: "ko", LT: "LT", LV: "LV", NL: "NL", PL: "PL", PT: "PT", RO: "RO", RU: "RU", SK: "SK", SL: "SL", SV: "SV", TR: "TR", ZH: "ZH" },
		Baidu: {
			AUTO: "auto",
			AR: "ara",
			CS: "cs",
			DA: "dan",
			DE: "de",
			EL: "el",
			EN: "en",
			ES: "spa",
			ET: "est",
			FI: "fin",
			FR: "fra",
			HU: "hu",
			IT: "it",
			JA: "jp",
			KO: "kor",
			NL: "nl",
			PL: "pl",
			PT: "pt",
			RO: "RO",
			RU: "rom",
			SL: "slo",
			SV: "swe",
			TH: "th",
			VI: "vie",
			ZH: "zh",
			"ZH-HANS": "zh",
			"ZH-HK": "cht",
			"ZH-HANT": "cht",
		},
	};

	#UAPool = [
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36", // 13.5%
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36", // 6.6%
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:94.0) Gecko/20100101 Firefox/94.0", // 6.4%
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:95.0) Gecko/20100101 Firefox/95.0", // 6.2%
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36", // 5.2%
		"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.55 Safari/537.36", // 4.8%
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 Edge/17.17134",
		"Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
		"Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1 Mobile/15E148 Safari/604.1",
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
		"Mozilla/5.0 (Windows NT 6.1; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0",
	];

	#Length = {
		Google: 120,
		GoogleCloud: 120,
		Microsoft: 99,
		Azure: 99,
		DeepL: 49,
		OpenAI: 50,
	};

	async Google(text = [], source = this.Source, target = this.Target) {
		text = Array.isArray(text) ? text : [text];
		source = this.#LanguagesCode.Google[source] ?? this.#LanguagesCode.Google[source?.split?.(/[-_]/)?.[0]] ?? source.toLowerCase();
		target = this.#LanguagesCode.Google[target] ?? this.#LanguagesCode.Google[target?.split?.(/[-_]/)?.[0]] ?? target.toLowerCase();
		const BaseRequest = [
			{
				// Google API
				url: "https://translate.googleapis.com/translate_a/single?client=gtx&dt=t",
				headers: {
					Accept: "*/*",
					"User-Agent": this.#UAPool[Math.floor(Math.random() * this.#UAPool.length)], // 随机UA
					Referer: "https://translate.google.com",
				},
			},
			{
				// Google Dictionary Chrome extension https://chrome.google.com/webstore/detail/google-dictionary-by-goog/mgijmajocgfcbeboacabfgobmjgjcoja
				url: "https://clients5.google.com/translate_a/t?client=dict-chrome-ex",
				headers: {
					Accept: "*/*",
					"User-Agent": this.#UAPool[Math.floor(Math.random() * this.#UAPool.length)], // 随机UA
				},
			},
			{
				// Google Translate App
				url: "https://translate.google.com/translate_a/single?client=it&dt=qca&dt=t&dt=rmt&dt=bd&dt=rms&dt=sos&dt=md&dt=gt&dt=ld&dt=ss&dt=ex&otf=2&dj=1&hl=en&ie=UTF-8&oe=UTF-8",
				headers: {
					Accept: "*/*",
					"User-Agent": "GoogleTranslate/6.29.59279 (iPhone; iOS 15.4; en; iPhone14,2)",
				},
			},
			{
				// Google Translate App
				url: "https://translate.googleapis.com/translate_a/single?client=gtx&dj=1&source=bubble&dt=t&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&dt=at",
				headers: {
					Accept: "*/*",
					"User-Agent": "GoogleTranslate/6.29.59279 (iPhone; iOS 15.4; en; iPhone14,2)",
				},
			},
		];
		const request = BaseRequest[Math.floor(Math.random() * (BaseRequest.length - 2))]; // 随机Request, 排除最后两项
		request.url = `${request.url}&sl=${source}&tl=${target}&q=${encodeURIComponent(text.join("\r"))}`;
		return await fetch(request)
			.then(response => {
				const body = JSON.parse(response.body);
				if (Array.isArray(body)) {
					if (Array.isArray(body?.[0])) {
						if (body.length === 1) {
							body[0].pop();
							text = body[0] ?? `翻译失败, vendor: ${"google"}`;
						} else text = body?.[0]?.map(item => item?.[0] ?? `翻译失败, vendor: ${"google"}`);
					} else text = body ?? `翻译失败, vendor: ${"google"}`;
				} else if (body?.sentences) text = body?.sentences?.map(item => item?.trans ?? `翻译失败, vendor: ${"google"}`);
				return text?.join("")?.split(/\r/);
			})
			.catch(error => Promise.reject(error));
	}

	async GoogleCloud(text = [], source = this.Source, target = this.Target, api = this.API) {
		text = Array.isArray(text) ? text : [text];
		source = this.#LanguagesCode.Google[source] ?? this.#LanguagesCode.Google[source?.split?.(/[-_]/)?.[0]] ?? source.toLowerCase();
		target = this.#LanguagesCode.Google[target] ?? this.#LanguagesCode.Google[target?.split?.(/[-_]/)?.[0]] ?? target.toLowerCase();
		const request = {};
		const BaseURL = "https://translation.googleapis.com";
		switch (api?.Version) {
			case "v2":
			default:
				request.url = `${BaseURL}/language/translate/v2`;
				request.headers = {
					//"Authorization": `Bearer ${api?.Token ?? api?.Auth}`,
					"User-Agent": "DualSubs",
					"Content-Type": "application/json; charset=utf-8",
				};
				request.body = JSON.stringify({
					q: text,
					source: source,
					target: target,
					format: "html",
					//"key": api?.Key
				});
				switch (api?.Mode) {
					case "Token":
						request.headers.Authorization = `Bearer ${api?.Token ?? api?.Auth}`;
						break;
					case "Key":
					default:
						request.url += `?key=${api?.Key ?? api?.Auth}`;
						break;
				}
				break;
			case "v3":
				request.url = `${BaseURL}/v3/projects/${api?.ID}`;
				request.headers = {
					Authorization: `Bearer ${api?.Token ?? api?.Auth}`,
					"x-goog-user-project": api?.ID,
					"User-Agent": "DualSubs",
					"Content-Type": "application/json; charset=utf-8",
				};
				request.body = JSON.stringify({
					sourceLanguageCode: source,
					targetLanguageCode: target,
					contents: Array.isArray(text) ? text : [text],
					mimeType: "text/html",
				});
				break;
		}
		return await fetch(request)
			.then(response => {
				const body = JSON.parse(response.body);
				return body?.data?.translations?.map(item => item?.translatedText ?? `翻译失败, vendor: ${"GoogleCloud"}`);
			})
			.catch(error => Promise.reject(error));
	}

	async Microsoft(text = [], source = this.Source, target = this.Target, api = this.API) {
		text = Array.isArray(text) ? text : [text];
		source = this.#LanguagesCode.Microsoft[source] ?? this.#LanguagesCode.Microsoft[source?.split?.(/[-_]/)?.[0]] ?? source.toLowerCase();
		target = this.#LanguagesCode.Microsoft[target] ?? this.#LanguagesCode.Microsoft[target?.split?.(/[-_]/)?.[0]] ?? target.toLowerCase();
		const request = {};
		let BaseURL = "https://api.cognitive.microsofttranslator.com";
		switch (api?.Version) {
			case "Azure":
			default:
				BaseURL = "https://api.cognitive.microsofttranslator.com";
				break;
			case "AzureCN":
				BaseURL = "https://api.translator.azure.cn";
				break;
			case "AzureUS":
				BaseURL = "https://api.cognitive.microsofttranslator.us";
				break;
		}
		request.url = `${BaseURL}/translate?api-version=3.0&textType=html&${source ? `from=${source}` : ""}&to=${target}`;
		request.headers = {
			"Content-Type": "application/json; charset=UTF-8",
			Accept: "application/json, text/javascript, */*; q=0.01",
			"Accept-Language": "zh-hans",
			//"Authorization": `Bearer ${api?.Auth}`,
			//"Ocp-Apim-Subscription-Key": api?.Auth,
			//"Ocp-Apim-Subscription-Region": api?.Region, // chinanorth, chinaeast2
			//"X-ClientTraceId": uuidv4().toString()
		};
		switch (api?.Mode) {
			case "Token":
			default:
				request.headers.Authorization = `Bearer ${api?.Token ?? api?.Auth}`;
				break;
			case "Key":
				request.headers["Ocp-Apim-Subscription-Key"] = api?.Key ?? api?.Auth;
				request.headers["Ocp-Apim-Subscription-Region"] = api?.Region;
				break;
		}
		text = text.map(item => {
			return { text: item };
		});
		request.body = JSON.stringify(text);
		return await fetch(request)
			.then(response => {
				const body = JSON.parse(response.body);
				return body?.map(item => item?.translations?.[0]?.text ?? `翻译失败, vendor: ${"Microsoft"}`);
			})
			.catch(error => Promise.reject(error));
	}

	async DeepL(text = [], source = this.Source, target = this.Target, api = this.API) {
		text = Array.isArray(text) ? text : [text];
		source = this.#LanguagesCode.DeepL[source] ?? this.#LanguagesCode.DeepL[source?.split?.(/[-_]/)?.[0]] ?? source.toLowerCase();
		target = this.#LanguagesCode.DeepL[target] ?? this.#LanguagesCode.DeepL[target?.split?.(/[-_]/)?.[0]] ?? target.toLowerCase();
		const request = {};
		let BaseURL = "https://api-free.deepl.com";
		switch (api?.Version) {
			case "Free":
			default:
				BaseURL = "https://api-free.deepl.com";
				break;
			case "Pro":
				BaseURL = "https://api.deepl.com";
				break;
		}
		request.url = `${BaseURL}/v2/translate`;
		request.headers = {
			//"Accept": "*/*",
			"User-Agent": "DualSubs",
			"Content-Type": "application/json",
			Authorization: `DeepL-Auth-Key ${api?.Token ?? api?.Auth}`,
		};
		const body = {
			text: text,
			//"source_lang": source,
			target_lang: target,
			tag_handling: "html",
		};
		if (source) body.source_lang = source;
		request.body = JSON.stringify(body);
		return await fetch(request)
			.then(response => {
				const body = JSON.parse(response.body);
				return body?.translations?.map(item => item?.text ?? `翻译失败, vendor: ${"DeepL"}`);
			})
			.catch(error => Promise.reject(error));
	}

	async BaiduFanyi(text = [], source = this.Source, target = this.Target, api = this.API) {
		text = Array.isArray(text) ? text : [text];
		source = this.#LanguagesCode.Baidu[source] ?? this.#LanguagesCode.Baidu[source?.split?.(/[-_]/)?.[0]] ?? source.toLowerCase();
		target = this.#LanguagesCode.Baidu[target] ?? this.#LanguagesCode.Baidu[target?.split?.(/[-_]/)?.[0]] ?? target.toLowerCase();
		const request = {};
		// https://fanyi-api.baidu.com/doc/24
		const BaseURL = "https://fanyi-api.baidu.com";
		request.url = `${BaseURL}/api/trans/vip/language`;
		request.headers = {
			"User-Agent": "DualSubs",
			"Content-Type": "application/x-www-form-urlencoded",
		};
		const salt = new Date().getTime();
		request.body = `q=${encodeURIComponent(text.join("\n"))}&from=${source}&to=${target}&appid=${api.id}&salt=${salt}&sign=${MD5(api.id + text + salt + api.key)}`;
		return await fetch(request)
			.then(response => {
				const body = JSON.parse(response.body);
				return body?.trans_result?.map(item => item?.dst ?? `翻译失败, vendor: ${"BaiduFanyi"}`);
			})
			.catch(error => Promise.reject(Console.error(error)));
	}

	async YoudaoAI(text = [], source = this.Source, target = this.Target, api = this.API) {
		text = Array.isArray(text) ? text : [text];
		source = this.#LanguagesCode.Youdao[source] ?? this.#LanguagesCode.Youdao[source?.split?.(/[-_]/)?.[0]];
		target = this.#LanguagesCode.Youdao[target] ?? this.#LanguagesCode.Youdao[target?.split?.(/[-_]/)?.[0]];
		const request = {};
		// https://ai.youdao.com/docs
		// https://ai.youdao.com/DOCSIRMA/html/自然语言翻译/API文档/文本翻译服务/文本翻译服务-API文档.html
		const BaseURL = "https://openapi.youdao.com";
		request.url = `${BaseURL}/api`;
		request.headers = {
			"User-Agent": "DualSubs",
			"Content-Type": "application/json; charset=utf-8",
		};
		request.body = {
			q: text,
			from: source,
			to: target,
			appKey: api?.Key,
			salt: new Date().getTime(),
			signType: "v3",
			sign: "",
			curtime: Math.floor(+new Date() / 1000),
		};
		return await fetch(request)
			.then(response => {
				const body = JSON.parse(response.body);
				return body?.data ?? `翻译失败, vendor: ${"DeepL"}`;
			})
			.catch(error => Promise.reject(error));
		}

		/**
		 * 支持所有 OpenAI API 兼容的服务，包括：
		 * - OpenAI
		 * - Gemini (通过 OpenAI 兼容端点)
		 * - 本地部署的 LLM (如 Ollama, LMStudio, vLLM 等)
		 * - 其他 OpenAI 兼容服务
		 * @author DualSubs Modified
		 */
			async OpenAI(text = [], source = this.Source, target = this.Target, api = this.API) {
				text = Array.isArray(text) ? text : [text];
				const now = Date.now();
				const downUntil = Number(Storage.getItem("@DualSubs.Universal.Caches.OpenAI.DownUntil", 0) ?? 0);
				if (now < downUntil) return text.map(() => "");
				// 语言代码转换为自然语言名称
			const languageNames = {
			AUTO: "the same language as the source",
			ZH: "Chinese", "ZH-HANS": "Simplified Chinese", "ZH-HANT": "Traditional Chinese", "ZH-HK": "Traditional Chinese (Hong Kong)",
			EN: "English", "EN-US": "American English", "EN-GB": "British English",
			JA: "Japanese", KO: "Korean", DE: "German", FR: "French", ES: "Spanish",
			PT: "Portuguese", IT: "Italian", RU: "Russian", AR: "Arabic", TH: "Thai",
			VI: "Vietnamese", ID: "Indonesian", TR: "Turkish", PL: "Polish", NL: "Dutch",
			DA: "Danish", FI: "Finnish", SV: "Swedish", NO: "Norwegian", CS: "Czech",
			HU: "Hungarian", EL: "Greek", RO: "Romanian", SK: "Slovak", UK: "Ukrainian",
			BG: "Bulgarian", HR: "Croatian", LT: "Lithuanian", SL: "Slovenian", ET: "Estonian", LV: "Latvian",
		};
			const targetLang = languageNames[target] ?? languageNames[target?.split?.(/[-_]/)?.[0]] ?? target;
			const sourceLang = source === "AUTO" ? "" : (languageNames[source] ?? languageNames[source?.split?.(/[-_]/)?.[0]] ?? source);
			
				// 构建请求
				const request = {};
				const separator = "\n[LINE_BREAK]\n";
				const baseURL = (api?.BaseURL ?? api?.Endpoint ?? "https://api.openai.com").replace(/\/+$/, "");
				request.url = `${baseURL}/v1/chat/completions`;
				request.timeout = api?.Timeout ?? api?.timeout ?? 15000;
				// 本地/LAN 地址默认走 DIRECT，避免被代理转发导致 192.168.* 无法访问而超时
				if (/^https?:\/\/(localhost|127\\.0\\.0\\.1|10\\.|192\\.168\\.|172\\.(1[6-9]|2\\d|3[0-1])\\.)/i.test(baseURL)) {
					request.policy = api?.Policy ?? api?.policy ?? "DIRECT";
				}
				request.headers = {
					"Content-Type": "application/json",
					"User-Agent": "DualSubs",
				};
			// 添加认证头
			if (api?.Auth) {
				request.headers["Authorization"] = `Bearer ${api.Auth}`;
			}
			
			// 构建翻译提示
			const systemPrompt = `You are a professional subtitle translator. Translate the user's subtitles to ${targetLang}.
Rules:
1. Keep the translation natural and fluent.
2. Maintain the original meaning and tone.
3. Preserve HTML tags and special formatting exactly.
4. Preserve line breaks and DO NOT merge/split lines.
5. Output ONLY the translated text: no explanations, no numbering, no quotes, no code fences.
6. Keep the separator "[LINE_BREAK]" exactly unchanged.
${sourceLang ? `7. The source language is ${sourceLang}.` : ""}`;

			const userContent = text.join(separator);
			
			request.body = JSON.stringify({
				model: api?.Model ?? "gemini-3-pro-preview",
				messages: [
					{ role: "system", content: systemPrompt },
					{ role: "user", content: userContent }
				],
				temperature: 0.3,
				max_tokens: 4096,
			});
			
				return await fetch(request)
					.then(response => {
						const body = JSON.parse(response.body);
						if (body?.error) {
							Console.error(`OpenAI API Error: ${body.error.message}`);
							return text.map(() => "");
						}
						const translatedText = body?.choices?.[0]?.message?.content;
						if (!translatedText) {
							return text.map(() => "");
						}
						let translatedLines = [];
						if (translatedText.includes("[LINE_BREAK]")) {
							translatedLines = translatedText.split(/\s*\[LINE_BREAK\]\s*/).map(line => line.trim());
						} else {
						// 回退：按行分割翻译结果
						translatedLines = translatedText.trim().split(/\n/).map(line => line.trim());
					}
					// 确保返回的行数与输入相同
					if (translatedLines.length === text.length) {
						return translatedLines;
					} else if (translatedLines.length > text.length) {
						// 如果返回行数多，截取
						return translatedLines.slice(0, text.length);
						} else {
							// 如果返回行数少，用原文补齐
							return text.map((original, i) => translatedLines[i] ?? "");
						}
					})
					.catch(error => {
						Console.error(`OpenAI Translation Error: ${error}`);
						if (`${error}`.toLowerCase().includes("timeout")) {
							Storage.setItem("@DualSubs.Universal.Caches.OpenAI.DownUntil", now + 60 * 1000);
							return text.map(() => "");
						}
						return Promise.reject(error);
					});
			}
		}
