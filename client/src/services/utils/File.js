import { notification } from "antd";

export const domain =
  process.env.NODE_ENV === "production" ? "" : process.env.REACT_APP_HOSTNAME;
// const domain = `http://192.168.1.37:8080`

export const CONVERTIBLE_EXTENDSIONS =
  "doc,xml,docx,txt,pptx,ppt,csv,xls,xlsx,pdf".split(",");

export function validateFile(file, extensionList = [], maxSize) {
  const { name, size } = file;
  const extname = name.split(".").pop().toLocaleLowerCase();

  // Validate extensionList
  if (extensionList && extensionList.length) {
    if (!extensionList.includes(extname)) {
      notification.error({
        message: "Lỗi",
        description: `File ${name} không đúng định dạng (${extensionList.join(
          ", "
        )})`,
      });
      return false;
    }
  }

  // Validate extensionList
  if (typeof maxSize === "number" && maxSize > 0) {
    if (size > maxSize * 1000) {
      notification.error({
        message: "Lỗi",
        description: `File ${name} vượt quá dung lượng cho phép (${
          maxSize / 1e3
        }MB)`,
      });
      return false;
    }
  }

  return file;
}

export const FILE_EXPORT = {
  "receive-report-export": `${domain}/services/report/api/statistics/receive/report`,
  "send-report-export": `${domain}/services/report/api/statistics/send/report`,
  "response-report-export": `${domain}/services/report/api/statistics/comment/report`,
  "ticket-export": `${domain}/services/eticket/api/tickets/export`,
  "file-document": `${domain}/services/file/api/files/blob/document/`,
  "file-comment": `${domain}/services/file/api/files/blob/comment/`,
  "file-resource": `${domain}/services/file/api/files/blob/`,
  "slide-resource": `${domain}/services/manage`,
  "file-document-publish": `${domain}/services/file/api/files/blob/publish/`,
};

// export async function downloadFile({ url, name }) {
//   let cancel
//   let isCancel = false
//   const uid = uuid.v4()
//   try {
//     const progress = (percent, duration = 0) => {
//       notification.open({
//         key: uid,
//         placement: 'bottomRight',
//         Notification: `Đang tải ${name}`,
//         description: (
//           <>
//             <Progress percent={percent} status={percent < 100 ? 'active' : 'success'} />
//           </>
//         ),
//         duration,
//         // closeIcon: <></>,
//         btn:
//           percent < 100 ? (
//             <Button
//               type="link"
//               size="small"
//               onClick={() => {
//                 Modal.confirm({
//                   title: 'Bạn có muốn dừng tải?',
//                   okText: 'Có',
//                   cancelText: 'Không',
//                   onOk() {
//                     isCancel = true
//                     cancel()
//                     notification.close(uid)
//                   },
//                   onCancel() {},
//                 })
//               }}
//             >
//               Hủy tải
//             </Button>
//           ) : null,
//         icon:
//           percent < 100 ? (
//             <Icon type="loading" />
//           ) : (
//             <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
//           ),
//       })
//     }

//     const blob = await Http.get(url, {
//       responseType: 'blob',
//       cancelToken: new CancelToken(function executor(c) {
//         cancel = c
//       }),
//       onDownloadProgress: progressEvent => {
//         let percentCompleted = Math.floor((progressEvent.loaded / progressEvent.total) * 100)
//         progress(percentCompleted)
//       },
//     })

//     if (!isCancel) {
//       progress(100, 3)

//       if (blob) {
//         FileSaver.saveAs(blob, name)
//       } else {
//         Notification.error('Có lỗi xảy ra, xin vui lòng thử lại')
//       }
//     }
//   } catch (error) {
//     console.error(error)
//     notification.close(uid)
//     Notification.error('Có lỗi xảy ra, tập tin không tồn tại hoặc tài khoản không có quyền truy cập')
//   }
// }
