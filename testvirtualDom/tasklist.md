 - template如何转为带有标签及属性的对象，

    - 答：AST抽象语法树，我认为是vnode的前身~

- 全流程，模板为

    ```html
    <div id="abc"><p class="www">{{msg}}</p><p class="hhh"><span>{{msg1}}</span></p></div>
    ```

    - 核心函数parseStartTag（起始标签处理函数，得到tagName，匹配attrs得到key,value）执行完毕后调用parseHTML函数中填写的options.start,设置根元素，父级元素，并储存当前element于stack数组中，方便结束标签函数执行时的取出处理
 
    - 核心函数parseText（文本处理函数，得到{{}}之中的内容msg）判断条件是未能匹配<符号时，执行options.chars将当前元素如p的element设置children为匹配到text的element

    - 核心函数parseEndTag（结束标签处理函数）判断最后一个元素是否与当前的闭合标签tagname匹配，匹配的话执行options.end将之前stack数组中储存的上一个标签移动到前一个标签的子类并在stack数组中删除他

    - 全文主要以parse执行parseHTML,parse传入两个参数，template模板，options(start:判断起始标签，将得到的elemnt格式化为标准模式，end：判断结束标签，将父级向上一层滚动，chars将{{}}内容截取)

    - 起始标签的匹配细节

        ```html
        <div id="abc">
        ```

        - 1.判断是否以<为开始，第一个标签必然是，那么进入parseStartTag处理起始标签内容，startTagOpen正则进行匹配得到标签名<div或div,记录此标签的起始位置0，tagName为匹配得到的[1]div

        - advance将index向前推进<div个数目并且删除模板的<div以进行下一步正则匹配

        - 若此时匹配不到起始标签的闭合符号“>”，且能够匹配到属性如id=“abc”，那么将index继续向前推id=“abc”的长度，删除模板中id属性，循环操作直到匹配得到起始标签的闭合符号，index再推进>符号的长度，模板删除>后，记录此时为起始标签的结束位置

        - 此时我们匹配得到的元素还不够规范，长这样⏬,需要进行修改

        ```js
        {tagName: "div", attrs: 0: [" id="abc"", "id", "=", "abc", undefined, undefined, index: 0, input: " id="abc"><p class="www">{{msg}}</p><p class="hhh"><span>{{msg1}}</span></p></div>", groups: undefined], start: 0, end: 14}
        ```

        - handleStartTag方法判断是否为单标签，若不是即将格式化后的对象塞入数组stack中这里面没有start,end.只有{id:"abc"}和标签名，将lastTag设置为当前格式化完毕的标签

        - 最后进行parse的options.start处理，将第一个标签设置为CurrentParent,同时设为根元素,这样第一个标签<div id="abc">就处理完毕

    - 子元素标签的匹配

        - 由于模板还没遍历完毕，继续执行parseHTML，此时模板

          ```
          html = "<p class="www">{{msg}}</p><p class="hhh"><span>{{msg1}}</span></p></div>"
          ```

        - 匹配到p的起始标签继续执行新的一轮起始标签的匹配，区别在于此时需要设置currentParent即上一次遍历得到的div标签处理后的element的children数组属性加入当前p标签处理后的element，再将currentParent赋值为当前element,并且stack中塞入element,方便以后取出

    - 文本匹配

        - 此时模板为如下，不再匹配<起始标签符号，
        ```
          html = "{{msg}}</p><p class="hhh"><span>{{msg1}}</span></p></div>"
        ```
        
        - 设置```var text = (void 0), rest = (void 0), next = (void 0);```除了防止被重写外，还可以减少字节。void 0代替undefined省3个字节。

        - html.substring(0, >标签所在位置)截取得到{{msg}}, html.slice(>标签所在位置)截取得到剩余的模板，将索引向前推进{{msg}}长度，获取剩余模板

        - 此后执行parse的options.chars方法处理text,parseText处理文本塞入tokens数组中得到tokens = ["_s(msg)"]，currentParent的children加入type为2标记为文本标签
        ```{type: 2, expression: "_s(msg)+_s(msg)", text: "{{msg}}"}```

    - 闭合标签匹配

        - 匹配完毕将index推进</p>个长度，获取剩余模板，执行parseEndTag

        - parseEndTag通过stack找到最近一个元素的标签，如果存在执行options.end方法处理，将stack最后一个元素进行pre元素处理TODO:

        - 处理完该闭合标签后将stack长度减一并把currentParent指向最后一位，即闭合标签的父级,因为此时最高级div标签的elemnet的children已经完成了p标签的导入
            ```js
            {attrs:[{…}]
            attrsList:[{…}]
            attrsMap:{id: "abc"}
            children:Array(1)0:{type: 1, tag: "p", attrsList: Array(1), attrsMap: {…}, parent: {…}, …}
            parent:undefined
            tag:"div"
            type:1}
            ```