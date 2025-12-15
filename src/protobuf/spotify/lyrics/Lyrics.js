import { MessageType, RepeatType, ScalarType } from "@protobuf-ts/runtime";

// Spotify Lyrics Protobuf (精简实现：覆盖 DualSubs 需要访问/改写的字段)

export const SyncType = {
	UNSYNCED: 0,
	LINE_SYNCED: 1,
	SYLLABLE_SYNCED: 2,
};

class Syllable$Type extends MessageType {
	constructor() {
		super("Syllable", [
			{ no: 1, name: "startTimeMs", kind: "scalar", T: ScalarType.INT64 },
			{ no: 2, name: "numChars", kind: "scalar", T: ScalarType.INT64 },
		]);
	}
}
const Syllable = new Syllable$Type();

class LyricsLine$Type extends MessageType {
	constructor() {
		super("LyricsLine", [
			{ no: 1, name: "startTimeMs", kind: "scalar", T: ScalarType.INT64 },
			{ no: 2, name: "words", kind: "scalar", opt: true, T: ScalarType.STRING },
			{ no: 3, name: "syllables", kind: "message", repeat: RepeatType.UNPACKED, T: () => Syllable },
		]);
	}
}
const LyricsLine = new LyricsLine$Type();

class ColorData$Type extends MessageType {
	constructor() {
		super("ColorData", [
			{ no: 1, name: "background", kind: "scalar", T: ScalarType.INT32 },
			{ no: 2, name: "text", kind: "scalar", T: ScalarType.INT32 },
			{ no: 3, name: "highlightText", kind: "scalar", T: ScalarType.INT32 },
		]);
	}
}
const ColorData = new ColorData$Type();

class AndroidIntent$Type extends MessageType {
	constructor() {
		super("AndroidIntent", [
			{ no: 1, name: "provider", kind: "scalar", T: ScalarType.STRING },
			{ no: 2, name: "providerAndroidAppId", kind: "scalar", T: ScalarType.STRING },
			{ no: 3, name: "action", kind: "scalar", T: ScalarType.STRING },
			{ no: 4, name: "data", kind: "scalar", T: ScalarType.STRING },
			{ no: 5, name: "contentType", kind: "scalar", T: ScalarType.STRING },
		]);
	}
}
const AndroidIntent = new AndroidIntent$Type();

class Alternative$Type extends MessageType {
	constructor() {
		super("Alternative", [
			{ no: 1, name: "language", kind: "scalar", T: ScalarType.STRING },
			{ no: 2, name: "lines", kind: "scalar", repeat: RepeatType.UNPACKED, T: ScalarType.STRING },
		]);
	}
}
const Alternative = new Alternative$Type();

class LyricsResponse$Type extends MessageType {
	constructor() {
		super("LyricsResponse", [
			{ no: 1, name: "syncType", kind: "enum", T: () => ["SyncType", SyncType] },
			{ no: 2, name: "lines", kind: "message", repeat: RepeatType.UNPACKED, T: () => LyricsLine },
			{ no: 3, name: "provider", kind: "scalar", T: ScalarType.STRING },
			{ no: 4, name: "providerLyricsId", kind: "scalar", T: ScalarType.STRING },
			{ no: 5, name: "providerDisplayName", kind: "scalar", T: ScalarType.STRING },
			{ no: 6, name: "syncLyricsAndroidIntent", kind: "message", T: () => AndroidIntent },
			{ no: 7, name: "syncLyricsUri", kind: "scalar", T: ScalarType.STRING },
			{ no: 8, name: "isDenseTypeface", kind: "scalar", T: ScalarType.BOOL },
			{ no: 9, name: "alternatives", kind: "message", repeat: RepeatType.UNPACKED, T: () => Alternative },
			{ no: 10, name: "language", kind: "scalar", T: ScalarType.STRING },
			{ no: 11, name: "isRtlLanguage", kind: "scalar", opt: true, T: ScalarType.BOOL },
			{ no: 12, name: "fullscreenAction", kind: "scalar", T: ScalarType.INT32 },
			{ no: 13, name: "showUpsell", kind: "scalar", opt: true, T: ScalarType.BOOL },
		]);
	}
}
const LyricsResponse = new LyricsResponse$Type();

class ColorLyricsResponse$Type extends MessageType {
	constructor() {
		super("ColorLyricsResponse", [
			{ no: 1, name: "lyrics", kind: "message", T: () => LyricsResponse },
			{ no: 2, name: "colors", kind: "message", T: () => ColorData },
			{ no: 3, name: "hasVocalRemoval", kind: "scalar", opt: true, T: ScalarType.BOOL },
			{ no: 4, name: "vocalRemovalColors", kind: "message", T: () => ColorData },
		]);
	}
}

export const ColorLyricsResponse = new ColorLyricsResponse$Type();

