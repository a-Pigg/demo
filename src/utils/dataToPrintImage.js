import QRCode from "qrcodejs2";
import domtoimage from "dom-to-image";
import { i18n } from "@/i18n/index";
/**
 *
 * @param {*} template
 * @param {*} element
 * @param {*} printData
 * @param {*} printerDpi
 */
export const dataToPrintImg = (template, element, printData, printerDpi) => {
  return new Promise((resolve, reject) => {
    let tagEle = document.createElement("div");
    let dpi = printerDpi || template.dpi;
    tagEle.style.width = mmConverterPx(template.width, dpi) + "px";
    tagEle.style.height = mmConverterPx(template.height, dpi) + "px";
    tagEle.style.background = "#fff";
    tagEle.style.boxSizing = "border-box";
    tagEle.style.padding = mmConverterPx(template.margin, dpi) + "px";
    let tableWidth = mmConverterPx(template.tableWidth, dpi) + "px";
    let tableHeight = mmConverterPx(template.tableHeight, dpi) + "px";
    // 生成table
    let borderStyle = "none";
    let tdBorderStyle = "none";
    if (template.border) {
      borderStyle = template.borderWidth + "px solid #000";
      tdBorderStyle = template.tdBotderWidth + "px solid #000";
    }
    // table-layout:fixed;
    let tableStyle = `width:${tableWidth};
                      height:${tableHeight};
                      font:${template.fontFace};
                      border:${borderStyle};
                      border-collapse:collapse;
                      box-sizing:border-box;`;
    let tableEleHTML = `<table style="${tableStyle}" id="1">`;
    //  找出二维码或者一维码
    let codeData = template.tableCell.find((item) => {
      return item.type == "QRcode";
    });
    if (codeData) {
      let qrCodeElement = document.createElement("div");
      let codeText =
        printData == undefined ? codeData.data : printData[codeData.name];
      if (!codeText) codeText = i18n.t('h.drawLabelComponents74');
      new QRCode(qrCodeElement, {
        text: codeText,
        width: mmConverterNum(codeData.width, dpi),
        height: mmConverterNum(codeData.height, dpi),
        colorLight: "#ffffff", // 二维码背景色
        correctLevel: QRCode.CorrectLevel.H,
      });
      qrCodeElement.lastChild.onload = function () {
        for (let i = 0; i < template.rowNum; i++) {
          tableEleHTML += "<tr>";
          for (let j = 0; j < template.colNum; j++) {
            for (let k = 0; k < template.tableCell.length; k++) {
              if (
                template.tableCell[k].position[0] == i &&
                template.tableCell[k].position[1] == j
              ) {
                let fontSize =
                  printerDpi == undefined
                    ? template.tableCell[k].fontSize
                    : template.tableCell[k].fontSize *
                      (printerDpi / template.dpi);
                let tdStyle = `width:${mmConverterPx(
                  template.tableCell[k].width,
                  dpi
                )}px;
                                         height:${mmConverterPx(
                                           template.tableCell[k].height,
                                           dpi
                                         )}px;
                                         border:${tdBorderStyle};
                                         font-size:${fontSize}px;
                                         border-collapse:collapse;
                                         text-align:${
                                           template.tableCell[k].align
                                         };
                                         box-sizing:border-box;
                                         overflow:hidden;
                                         white-space:nowrap;
                                         text-overflow:ellipsis`;
                let cellContent = "";
                if (template.tableCell[k].type == "title") {
                  // cellContent = template.tableCell[k].data;
                  cellContent = `<p style="
                  width: ${mmConverterPx(template.tableCell[k].width, dpi)}px;
                  height: ${mmConverterPx(template.tableCell[k].height, dpi)}px;
                  line-height: ${mmConverterPx(
                    template.tableCell[k].height,
                    dpi
                  )}px;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                ">${template.tableCell[k].data}</p>`;
                } else if (template.tableCell[k].type == "data") {
                  // cellContent =
                  //   printData == undefined
                  //     ? template.tableCell[k].data
                  //     : printData[template.tableCell[k].name];
                  let data =
                    printData == undefined
                      ? template.tableCell[k].data
                      : printData[template.tableCell[k].name];
                  cellContent = `<p style="
                width: ${mmConverterPx(template.tableCell[k].width, dpi)}px;
                height: ${mmConverterPx(template.tableCell[k].height, dpi)}px;
                line-height: ${mmConverterPx(
                  template.tableCell[k].height,
                  dpi
                )}px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              ">${data == null ? "" : data}</p>`;
                } else if (template.tableCell[k].type == "logo") {
                  if (template.tableCell[k].logo) {
                    let imgWidth = mmConverterPx(
                      template.tableCell[k].imgWidth,
                      dpi
                    );
                    let imgHeight = mmConverterPx(
                      template.tableCell[k].imgHeight,
                      dpi
                    );
                    cellContent = `<img
                                  src="${template.tableCell[k].logo}"
                                  style="vertical-align:middle;width:${imgWidth}px;height:${imgHeight}px"/>`;
                    // cellContent = `<img
                    //               src="${template.tableCell[k].logo}"
                    //               style="vertical-align:middle;width:${template.tableCell[k].imgWidth}px;height:${template.tableCell[k].imgHeight}px"/>`;
                  }
                } else if (template.tableCell[k].type == "QRcode") {
                  let tdWidth = mmConverterPx(template.tableCell[k].width, dpi);
                  let tdHeight = mmConverterPx(
                    template.tableCell[k].height,
                    dpi
                  );
                  let qrCodeLength =
                    tdWidth - tdHeight > 0
                      ? ((tdHeight - 10) / 10) *
                        template.tableCell[k].codeProportion
                      : ((tdWidth - 10) / 10) *
                        template.tableCell[k].codeProportion;
                  cellContent = `<img 
                                              src="${qrCodeElement.lastChild.getAttribute(
                                                "src"
                                              )}" 
                                              style="width:${qrCodeLength}px;
                                                     height:${qrCodeLength}px;
                                                     vertical-align:middle"/>`;
                }
                tableEleHTML += `<td style="${tdStyle}" rowspan="${
                  template.tableCell[k].rowSpan
                }" colspan="${template.tableCell[k].colSpan}">${
                  cellContent == null ? "" : cellContent
                }</td>`;
              }
            }
          }
          tableEleHTML += `</tr>`;
        }
        tableEleHTML += `</table>`;
        tagEle.innerHTML = tableEleHTML;
        element.appendChild(tagEle);
        domtoimage
          .toPng(tagEle)
          .then((res) => {
            if (printData) {
              resolve({
                title: template.name,
                name: printData.name,
                printDpi: dpi,
                EPC: printData.code,
                assetCode: printData.assetCode,
                base: res,
              });
            } else {
              resolve(res);
            }
          })
          .catch((err) => {
            reject(err);
          });
      };
    } else {
      for (let i = 0; i < template.rowNum; i++) {
        tableEleHTML += "<tr>";
        for (let j = 0; j < template.colNum; j++) {
          for (let k = 0; k < template.tableCell.length; k++) {
            if (
              template.tableCell[k].position[0] == i &&
              template.tableCell[k].position[1] == j
            ) {
              let fontSize =
                printerDpi == undefined
                  ? template.tableCell[k].fontSize
                  : template.tableCell[k].fontSize *
                    (printerDpi / template.dpi);
              let tdStyle = `width:${mmConverterPx(
                template.tableCell[k].width,
                dpi
              )}px;
                                       height:${mmConverterPx(
                                         template.tableCell[k].height,
                                         dpi
                                       )}px;
                                       border:${tdBorderStyle};
                                       font-size:${fontSize}px;
                                       border-collapse:collapse;
                                       text-align:${
                                         template.tableCell[k].align
                                       };
                                       box-sizing:border-box;
                                       overflow:hidden;
                                       white-space:nowrap;
                                       text-overflow:ellipsis`;

              let cellContent = "";
              if (template.tableCell[k].type == "title") {
                // cellContent = template.tableCell[k].data;
                cellContent = `<p style="
                width: ${mmConverterPx(template.tableCell[k].width, dpi)}px;
                height: ${mmConverterPx(template.tableCell[k].height, dpi)}px;
                line-height: ${mmConverterPx(
                  template.tableCell[k].height,
                  dpi
                )}px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              ">${template.tableCell[k].data}</p>`;
              } else if (template.tableCell[k].type == "data") {
                let data =
                  printData == undefined
                    ? template.tableCell[k].data
                    : printData[template.tableCell[k].name];
                cellContent = `<p style="
                width: ${mmConverterPx(template.tableCell[k].width, dpi)}px;
                height: ${mmConverterPx(template.tableCell[k].height, dpi)}px;
                line-height: ${mmConverterPx(
                  template.tableCell[k].height,
                  dpi
                )}px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              ">${data == null ? "" : data}</p>`;
              } else if (template.tableCell[k].type == "logo") {
                if (template.tableCell[k].logo) {
                  let imgWidth = mmConverterPx(
                    template.tableCell[k].imgWidth,
                    dpi
                  );
                  let imgHeight = mmConverterPx(
                    template.tableCell[k].imgHeight,
                    dpi
                  );
                  cellContent = `<img
                                src="${template.tableCell[k].logo}"
                                style="vertical-align:middle;width:${imgWidth}px;height:${imgHeight}px"/>`;
                  // cellContent = `<img
                  //               src="${template.tableCell[k].logo}"
                  //               style="vertical-align:middle;width:${template.tableCell[k].imgWidth}px;height:${template.tableCell[k].imgHeight}px"/>`;
                }
              }
              tableEleHTML += `<td style="${tdStyle}" rowspan="${
                template.tableCell[k].rowSpan
              }" colspan="${template.tableCell[k].colSpan}">${
                cellContent == null ? "" : cellContent
              }</td>`;
            }
          }
        }
        tableEleHTML += `</tr>`;
      }
      tableEleHTML += `</table>`;
      tagEle.innerHTML = tableEleHTML;
      element.appendChild(tagEle);
      domtoimage
        .toPng(tagEle)
        .then((res) => {
          if (printData) {
            resolve({
              title: template.name,
              name: printData.name,
              printDpi: dpi,
              EPC: printData.code,
              assetCode: printData.assetCode,
              base: res,
            });
          } else {
            resolve(res);
          }
        })
        .catch((err) => {
          reject(err);
        });
    }
  });
};

/**
 *
 * @param {*} mm
 * @param {*} dpi
 * @returns
 */
function mmConverterPx(mm, dpi) {
  return Math.floor((mm / 25.4) * dpi * 100) / 100;
}
function mmConverterNum(mm, dpi) {
  return Math.floor((mm / 25.4) * dpi * 100) / 100;
}
