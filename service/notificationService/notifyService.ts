import {toast, ToastPosition} from "react-toastify";

export const SUCCESS_NOTIFICATION = "success";
export const ERROR_NOTIFICATION = "error";
export const WARNING_NOTIFICATION = "warning";
export const INFO_NOTIFICATION = "info";

interface INotifyService {
  message: string;
  type: string;
  id?: string | number;
  position?: ToastPosition;
  autoClose?: number;
}

export const notifyService = ({
  message,
  type,
  id,
  position = "top-right",
  autoClose = 3000,
}: INotifyService) => {
  const options = {
    position,
    toastId: id,
    autoClose,
    hideProgressBar: false,
    closeButton: true,
  };
  
  switch (type) {
    case SUCCESS_NOTIFICATION:
      toast.success(message, options);
      break;
    case ERROR_NOTIFICATION:
      toast.error(message, options);
      break;
    case WARNING_NOTIFICATION:
      toast.warn(message, options);
      break;
    case INFO_NOTIFICATION:
      toast.info(message, options);
      break;
    default:
      toast(message, options);
      break;
  }
};
