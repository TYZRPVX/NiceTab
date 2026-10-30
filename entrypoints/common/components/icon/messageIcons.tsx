import type { MessageInstance, NoticeType, TypeOpen } from 'antd/es/message/interface';
import {
  CircleCheckIcon,
  CircleXIcon,
  CircleAlertIcon,
  InfoIcon,
  LoaderCircleIcon,
} from './Icons';

const icons = {
  success: <CircleCheckIcon />,
  error: <CircleXIcon />,
  warning: <CircleAlertIcon />,
  info: <InfoIcon />,
  loading: <LoaderCircleIcon spin />,
};

// One small adapter per mounted Root; preserves Ant's close callback/thenable API.
export function withMessageIcons(api: MessageInstance): MessageInstance {
  const method =
    (type: NoticeType): TypeOpen =>
    (content, duration, onClose) => {
      const config =
        content && typeof content === 'object' && 'content' in content
          ? content
          : { content };
      return api[type]({ icon: icons[type], ...config }, duration, onClose);
    };
  return {
    ...api,
    info: method('info'),
    success: method('success'),
    error: method('error'),
    warning: method('warning'),
    loading: method('loading'),
    open: args => api.open({ icon: icons[args.type || 'info'], ...args }),
  };
}
