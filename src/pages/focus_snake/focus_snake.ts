/**
 * 编辑作者：张诗涛
 * 创建时间：2018年4月12日 21点45分
 * 功能分类：Focus 模块使用示例
 */
import { Focus, FocusType, PageEvent, PageType, HElement, Key, Json, Random } from "../../framework/framework";

enum MType {
    Left
}

let pageEvent = new PageEvent(MType.Left, [
    {
        topic: PageType.Keydown, data: null, handler: [
            MType.Left
        ]
    }
], true);

let eleTips = new HElement('#tips');
let fishIndex = -1; // 记录鱼坐标
let len = 1;        // 记录身体长度

let focLeft = new Focus({
    identCode: MType.Left,
    width: 5,
    className: "focus"
}, pageEvent);

focLeft.initData(new HElement("#con-lf").children("div"));

// 监听蛇爬行
pageEvent.on(MType.Left, FocusType.Changed, (e: IChanged) => {
    let ele = e.site.element;

    // 有效的爬行动作
    if (e.success) {
        // 重置方向
        focLeft.record().forEach((v, i) => {
            v.element.removeClass("head");
            v.element.removeClass("body");
            v.element.style("background-image", "");
        });
        // 方向
        if (Key.Left === e.keyCode) {
            e.site.element.style("background-image", "url('./images/head_left.png')");
        }
        else if (Key.Up === e.keyCode) {
            e.site.element.style("background-image", "url('./images/head_up.png')");
        }
        else if (Key.Right === e.keyCode) {
            e.site.element.style("background-image", "url('./images/head_right.png')");
        }
        else if (Key.Down === e.keyCode) {
            e.site.element.style("background-image", "url('./images/head_down.png')");
        }

        // 吃到鱼
        if (fishIndex === e.site.index) {

            ele.removeClass('fish');
            // 身体长大一节
            if (len <= 10) {
                len++;
            } else {
                // 禁用
                pageEvent.disableTopic(MType.Left);

                eleTips.html("恭喜通关!")
            }
            createFish();
        }

        // 重置身体
        focLeft.record().forEach((v, i) => {
            v.element.removeClass("head");
            v.element.removeClass("body");
        });

        // 绘画身体
        focLeft.record().reverse();

        focLeft.record().forEach((v, i) => {
            if (i < len) {
                if (i === 0) {
                    v.element.addClass("head");
                } else {
                    v.element.addClass("body");
                }
            }
        });

        focLeft.record().reverse();
    } else {

    }
});

createFish();

// 创建一条鱼
function createFish() {
    let records = focLeft.record();

    let bodys: number[] = [];

    records.reverse();

    records.forEach((v, i) => {
        if (i < len) {
            bodys.push(v.index);
        }
    });

    records.reverse();

    // 排除身体
    let idx = -1, v: number;
    do {
        v = Random.scope(0, focLeft.getSites().length);

        if (bodys.every((v_2) => {
            return v_2 !== v;
        })) {
            idx = v;
        }
    } while (-1 === idx);

    fishIndex = idx;
    focLeft.getSites()[fishIndex].element.addClass('fish');
}
