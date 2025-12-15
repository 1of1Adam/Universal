#!/usr/bin/env python3
"""
Patch the DualSubs Translate.response.bundle.js to add OpenAI support with Gemini
"""

import re
import sys

def patch_bundle(input_file, output_file):
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. 修改默认 Vendor 从 "Google" 到 "OpenAI"
    content = content.replace('Vendor:"Google"', 'Vendor:"OpenAI"')
    print("✅ Changed default Vendor to OpenAI")
    
    # 2. 添加 OpenAI 到 Length 配置
    content = content.replace(
        'GoogleCloud:120,Microsoft:99,Azure:99,DeepL:49}',
        'GoogleCloud:120,Microsoft:99,Azure:99,DeepL:49,OpenAI:50}'
    )
    print("✅ Added OpenAI to Length config")
    
    # 3. 在 Translator 函数中添加 OpenAI case (在翻译长度设置 switch 语句中)
    old_switch = 'case"DeepLX":n=20;break'
    new_switch = 'case"DeepLX":n=20;break;case"OpenAI":n=50;break'
    content = content.replace(old_switch, new_switch)
    print("✅ Added OpenAI case to Translator length switch")
    
    # 4. 添加 OpenAI API 配置到 API.Settings
    old_api = 'GoogleCloud:{Version:"v2",Mode:"Key",Auth:""}'
    new_api = 'OpenAI:{BaseURL:"http://192.168.31.203:8317/v1",Model:"gemini-3-pro-preview",Auth:"dummy-not-used"},GoogleCloud:{Version:"v2",Mode:"Key",Auth:""}'
    content = content.replace(old_api, new_api)
    print("✅ Added OpenAI API configuration")
    
    # 5. 在 YoudaoAI 方法结尾后插入 OpenAI 方法
    # YoudaoAI 方法以 }).catch(e=>Promise.reject(e))}} 结尾，后面是 let I=Symbol.for(
    
    # OpenAI 翻译方法 - 使用优化的中文翻译提示词
    system_prompt = '''你是专业字幕翻译。将以下字幕从 ${t==="auto"?"自动检测的语言":t} 翻译为 ${a}。翻译原则：1. 语义精确但表达自然，像人说的话。按中文语序重组，不逐词替换。保留语气情绪。口头填充词可适当压缩。2. 结合上下文消歧义，保持术语、人物、情绪连贯。跨块句子自然衔接。3. 俚语双关文化梗用中文等效表达；无等效则说清意图，不硬译。不添加原文没有的信息。专有名词处理：1. 人名、地名、机构、品牌、软件、术语缩写、作品标题等：默认保留原文拼写与大小写，不确定时保留原文。2. 若有通行中文名，可用中文名（原文）或原文（中文名），首次括注后保持一致。3. 作品标题可用《》标示。输出要求：1. 仅返回翻译后的文本 2. 保留HTML标签和特殊格式 3. 保持换行符位置不变'''
    
    openai_method = f'''async OpenAI(e=[],t=this.Source,a=this.Target,n=this.API){{e=Array.isArray(e)?e:[e];t=this.#T.Google[t]??this.#T.Google[t?.split?.(/[-_]/)?.[0]]??t.toLowerCase();a=this.#T.Google[a]??this.#T.Google[a?.split?.(/[-_]/)?.[0]]??a.toLowerCase();const s=n?.BaseURL||n?.Endpoint||"http://192.168.31.203:8317/v1",r=n?.Model||"gemini-3-pro-preview",i=n?.Auth||n?.Key||"dummy-not-used";let o={{url:`${{s}}/chat/completions`,headers:{{"Content-Type":"application/json","User-Agent":"DualSubs"}},body:JSON.stringify({{model:r,messages:[{{role:"system",content:`{system_prompt}`}},{{role:"user",content:e.join("\\n[LINE_BREAK]\\n")}}],temperature:0.3,max_tokens:4096}})}};if(i)o.headers.Authorization=`Bearer ${{i}}`;return await l(o).then(e=>{{const t=JSON.parse(e.body)?.choices?.[0]?.message?.content;if(t)return t.split("\\n[LINE_BREAK]\\n").map(e=>e.trim());return e.map(()=>"翻译失败, vendor: OpenAI")}}).catch(e=>Promise.reject(e))}}'''
    
    # 查找插入点：YoudaoAI 方法结尾
    old_pattern = '}).catch(e=>Promise.reject(e))}}let I=Symbol.for'
    new_pattern = '}).catch(e=>Promise.reject(e))}' + openai_method + '}let I=Symbol.for'
    
    if old_pattern in content:
        content = content.replace(old_pattern, new_pattern)
        print("✅ Successfully inserted OpenAI method after YoudaoAI")
    else:
        print("⚠️ Could not find exact insertion point, trying alternative...")
        alt_pattern = 'Promise.reject(e))}}let'
        if alt_pattern in content:
            content = content.replace(alt_pattern, 'Promise.reject(e))}' + openai_method + '}let')
            print("✅ Inserted OpenAI method using alternative pattern")
        else:
            print("❌ Failed to find insertion point")
            return False
    
    # 写入输出文件
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ Patched bundle saved to: {output_file}")
    
    # 验证修改
    with open(output_file, 'r', encoding='utf-8') as f:
        patched = f.read()
    
    if 'async OpenAI(' in patched:
        print("✅ Verification: OpenAI method found in patched bundle")
    else:
        print("❌ Verification failed: OpenAI method not found")
    
    if 'Vendor:"OpenAI"' in patched:
        print("✅ Verification: Default vendor changed to OpenAI")
    else:
        print("⚠️ Verification: Default vendor might not be changed")
        
    return True

if __name__ == "__main__":
    input_file = "/Users/adampeng/Documents/Universal/dist/Translate.response.bundle.js"
    output_file = "/Users/adampeng/Documents/Universal/dist/Translate.response.gemini.bundle.js"
    
    if len(sys.argv) > 1:
        input_file = sys.argv[1]
    if len(sys.argv) > 2:
        output_file = sys.argv[2]
    
    patch_bundle(input_file, output_file)
