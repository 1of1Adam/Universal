import { MessageType, RepeatType, ScalarType } from "@protobuf-ts/runtime";

/**
 * 说明：
 * - 这里并不追求完整还原 YouTube 的 proto schema，只实现 DualSubs 目前用到的字段树。
 * - 依赖 protobuf-ts 的 unknown field 机制，未声明的字段会被保留并在 toBinary() 时写回。
 * - `contents.renderer` 是一个兼容层：历史版本直接在 contents 下挂各类 renderer，
 *   近期代码改为 `contents.renderer.xxx` 访问。这里通过 getter 让两种写法都能工作。
 */

// ---- Leaf ----
class N13F1$Type extends MessageType {
	constructor() {
		super("n13F1", [{ no: 1, name: "f1", kind: "scalar", T: ScalarType.STRING }]);
	}
}
const N13F1 = new N13F1$Type();

class N12F4$Type extends MessageType {
	constructor() {
		super("n12F4", [
			{ no: 1, name: "n13F1", kind: "message", repeat: RepeatType.UNPACKED, T: () => N13F1 },
			{ no: 2, name: "originText", kind: "scalar", T: ScalarType.STRING },
		]);
	}
}
const N12F4 = new N12F4$Type();

class N11F465160965$Type extends MessageType {
	constructor() {
		super("n11F465160965", [{ no: 4, name: "n12F4", kind: "message", T: () => N12F4 }]);
	}
}
const N11F465160965 = new N11F465160965$Type();

class N10F5$Type extends MessageType {
	constructor() {
		super("n10F5", [{ no: 465160965, name: "n11F465160965", kind: "message", T: () => N11F465160965 }]);
	}
}
const N10F5 = new N10F5$Type();

class N9F168777401$Type extends MessageType {
	constructor() {
		super("n9F168777401", [{ no: 5, name: "n10F5", kind: "message", T: () => N10F5 }]);
	}
}
const N9F168777401 = new N9F168777401$Type();

class N8F1$Type extends MessageType {
	constructor() {
		super("n8F1", [{ no: 168777401, name: "n9F168777401", kind: "message", T: () => N9F168777401 }]);
	}
}
const N8F1 = new N8F1$Type();

class N7F172660663$Type extends MessageType {
	constructor() {
		super("n7F172660663", [{ no: 1, name: "n8F1", kind: "message", T: () => N8F1 }]);
	}
}
const N7F172660663 = new N7F172660663$Type();

class ElementRenderer$Type extends MessageType {
	constructor() {
		super("elementRenderer", [{ no: 172660663, name: "n7F172660663", kind: "message", T: () => N7F172660663 }]);
	}
}
const ElementRenderer = new ElementRenderer$Type();

// ---- Music description (lyrics) ----
class Runs$Type extends MessageType {
	constructor() {
		super("Runs", [{ no: 1, name: "text", kind: "scalar", T: ScalarType.STRING }]);
	}
}
const Runs = new Runs$Type();

class Description$Type extends MessageType {
	constructor() {
		super("Description", [{ no: 1, name: "runs", kind: "message", repeat: RepeatType.UNPACKED, T: () => Runs }]);
	}
}
const Description = new Description$Type();

class Footer$Type extends MessageType {
	constructor() {
		super("Footer", [{ no: 1, name: "runs", kind: "message", repeat: RepeatType.UNPACKED, T: () => Runs }]);
	}
}
const Footer = new Footer$Type();

class MusicDescriptionShelfRenderer$Type extends MessageType {
	constructor() {
		super("MusicDescriptionShelfRenderer", [
			{ no: 3, name: "description", kind: "message", T: () => Description },
			{ no: 10, name: "footer", kind: "message", T: () => Footer },
		]);
	}
}
const MusicDescriptionShelfRenderer = new MusicDescriptionShelfRenderer$Type();

// ---- Section list ----
class SectionListRenderer$Type extends MessageType {
	constructor() {
		super("SectionListRenderer", [
			{ no: 1, name: "contents", kind: "message", repeat: RepeatType.UNPACKED, T: () => Contents },
			{ no: 6, name: "header", kind: "message", T: () => Contents },
		]);
	}
}
const SectionListRenderer = new SectionListRenderer$Type();

class Contents$Type extends MessageType {
	constructor() {
		super("Contents", [
			{ no: 49399797, name: "sectionListRenderer", kind: "message", T: () => SectionListRenderer },
			{ no: 153515154, name: "elementRenderer", kind: "message", T: () => ElementRenderer },
			{ no: 221496734, name: "musicDescriptionShelfRenderer", kind: "message", T: () => MusicDescriptionShelfRenderer },
		]);

		// `contents.renderer === contents`，让 `contents.renderer.xxx` 与 `contents.xxx` 两种写法都可用
		Object.defineProperty(this.messagePrototype, "renderer", {
			get() {
				return this;
			},
		});
	}
}
const Contents = new Contents$Type();

class BrowseResponse$Type extends MessageType {
	constructor() {
		super("BrowseResponse", [
			{ no: 9, name: "contents", kind: "message", T: () => Contents },
			{ no: 10, name: "continuationContents", kind: "message", T: () => Contents },
		]);
	}
}

export const BrowseResponse = new BrowseResponse$Type();

