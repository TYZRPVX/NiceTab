import { forwardRef, type HTMLAttributes } from 'react';
import type { IconType } from 'react-icons';
import {
  LuMinus,
  LuClock,
  LuArrowRight,
  LuClockArrowUp,
  LuClockArrowDown,
  LuPanelLeft,
  LuPanelRight,
  LuArchive,
  LuInbox,
  LuArrowDown,
  LuArrowDownAZ,
  LuArrowRightLeft,
  LuArrowUp,
  LuArrowUpToLine,
  LuArrowUpZA,
  LuBookOpen,
  LuCamera,
  LuCheck,
  LuChevronDown,
  LuChevronRight,
  LuCircleAlert,
  LuCircleCheck,
  LuCircleHelp,
  LuCircleMinus,
  LuCircleX,
  LuCloudDownload,
  LuCloudUpload,
  LuCoffee,
  LuCopy,
  LuEllipsisVertical,
  LuEraser,
  LuExternalLink,
  LuEye,
  LuEyeOff,
  LuFolder,
  LuFolderInput,
  LuFolderOpen,
  LuFolderPlus,
  LuHistory,
  LuHouse,
  LuImport,
  LuInfo,
  LuKeyboard,
  LuLayers,
  LuLayoutGrid,
  LuLink,
  LuListEnd,
  LuListRestart,
  LuLoaderCircle,
  LuLock,
  LuLockOpen,
  LuMaximize,
  LuMenu,
  LuMinimize,
  LuMonitor,
  LuMoon,
  LuPalette,
  LuPanelsTopLeft,
  LuPencil,
  LuPin,
  LuPlus,
  LuQrCode,
  LuRefreshCw,
  LuRotateCw,
  LuSave,
  LuSearch,
  LuSettings,
  LuSmile,
  LuStar,
  LuSun,
  LuTag,
  LuTrash2,
  LuType,
  LuUndo2,
  LuWrench,
  LuX,
} from 'react-icons/lu';
import './icons.css';

export interface IconProps extends HTMLAttributes<HTMLSpanElement> {
  spin?: boolean;
  rotate?: number;
}

// Static SVG components only: no observers, caches, or background allocations.
// Keep an inline wrapper for Ant buttons, tooltip refs, and existing icon sizing.
function createIcon(Glyph: IconType, name: string) {
  const Icon = forwardRef<HTMLSpanElement, IconProps>(
    ({ spin, rotate, className, style, ...props }, ref) => (
      <span
        {...props}
        ref={ref}
        className={['anticon', 'nt-icon', spin && 'nt-icon-spin', className]
          .filter(Boolean)
          .join(' ')}
        style={{ ...style, ...(rotate ? { transform: `rotate(${rotate}deg)` } : {}) }}
      >
        <Glyph size="1em" strokeWidth={2} aria-hidden="true" focusable="false" />
      </span>
    ),
  );
  Icon.displayName = `${name}Icon`;
  return Icon;
}

export const ArchiveIcon = /* @__PURE__ */ createIcon(LuArchive, 'Archive');
export const InboxIcon = /* @__PURE__ */ createIcon(LuInbox, 'Inbox');
export const ArrowDownIcon = /* @__PURE__ */ createIcon(LuArrowDown, 'ArrowDown');
export const ArrowDownAZIcon = /* @__PURE__ */ createIcon(LuArrowDownAZ, 'ArrowDownAZ');
export const ArrowRightLeftIcon = /* @__PURE__ */ createIcon(
  LuArrowRightLeft,
  'ArrowRightLeft',
);
export const ArrowUpIcon = /* @__PURE__ */ createIcon(LuArrowUp, 'ArrowUp');
export const ArrowUpToLineIcon = /* @__PURE__ */ createIcon(
  LuArrowUpToLine,
  'ArrowUpToLine',
);
export const ArrowUpZAIcon = /* @__PURE__ */ createIcon(LuArrowUpZA, 'ArrowUpZA');
export const BookOpenIcon = /* @__PURE__ */ createIcon(LuBookOpen, 'BookOpen');
export const CameraIcon = /* @__PURE__ */ createIcon(LuCamera, 'Camera');
export const CheckIcon = /* @__PURE__ */ createIcon(LuCheck, 'Check');
export const ChevronDownIcon = /* @__PURE__ */ createIcon(LuChevronDown, 'ChevronDown');
export const ChevronRightIcon = /* @__PURE__ */ createIcon(
  LuChevronRight,
  'ChevronRight',
);
export const CircleAlertIcon = /* @__PURE__ */ createIcon(LuCircleAlert, 'CircleAlert');
export const CircleCheckIcon = /* @__PURE__ */ createIcon(LuCircleCheck, 'CircleCheck');
export const CircleHelpIcon = /* @__PURE__ */ createIcon(LuCircleHelp, 'CircleHelp');
export const CircleMinusIcon = /* @__PURE__ */ createIcon(LuCircleMinus, 'CircleMinus');
export const CircleXIcon = /* @__PURE__ */ createIcon(LuCircleX, 'CircleX');
export const CloudDownloadIcon = /* @__PURE__ */ createIcon(
  LuCloudDownload,
  'CloudDownload',
);
export const CloudUploadIcon = /* @__PURE__ */ createIcon(LuCloudUpload, 'CloudUpload');
export const CoffeeIcon = /* @__PURE__ */ createIcon(LuCoffee, 'Coffee');
export const CopyIcon = /* @__PURE__ */ createIcon(LuCopy, 'Copy');
export const EllipsisVerticalIcon = /* @__PURE__ */ createIcon(
  LuEllipsisVertical,
  'EllipsisVertical',
);
export const EraserIcon = /* @__PURE__ */ createIcon(LuEraser, 'Eraser');
export const ExternalLinkIcon = /* @__PURE__ */ createIcon(
  LuExternalLink,
  'ExternalLink',
);
export const EyeIcon = /* @__PURE__ */ createIcon(LuEye, 'Eye');
export const EyeOffIcon = /* @__PURE__ */ createIcon(LuEyeOff, 'EyeOff');
export const FolderIcon = /* @__PURE__ */ createIcon(LuFolder, 'Folder');
export const FolderInputIcon = /* @__PURE__ */ createIcon(LuFolderInput, 'FolderInput');
export const FolderOpenIcon = /* @__PURE__ */ createIcon(LuFolderOpen, 'FolderOpen');
export const FolderPlusIcon = /* @__PURE__ */ createIcon(LuFolderPlus, 'FolderPlus');
export const HistoryIcon = /* @__PURE__ */ createIcon(LuHistory, 'History');
export const HouseIcon = /* @__PURE__ */ createIcon(LuHouse, 'House');
export const ImportIcon = /* @__PURE__ */ createIcon(LuImport, 'Import');
export const InfoIcon = /* @__PURE__ */ createIcon(LuInfo, 'Info');
export const KeyboardIcon = /* @__PURE__ */ createIcon(LuKeyboard, 'Keyboard');
export const LayersIcon = /* @__PURE__ */ createIcon(LuLayers, 'Layers');
export const LayoutGridIcon = /* @__PURE__ */ createIcon(LuLayoutGrid, 'LayoutGrid');
export const LinkIcon = /* @__PURE__ */ createIcon(LuLink, 'Link');
export const ListEndIcon = /* @__PURE__ */ createIcon(LuListEnd, 'ListEnd');
export const ListRestartIcon = /* @__PURE__ */ createIcon(LuListRestart, 'ListRestart');
export const LoaderCircleIcon = /* @__PURE__ */ createIcon(
  LuLoaderCircle,
  'LoaderCircle',
);
export const LockIcon = /* @__PURE__ */ createIcon(LuLock, 'Lock');
export const LockOpenIcon = /* @__PURE__ */ createIcon(LuLockOpen, 'LockOpen');
export const MaximizeIcon = /* @__PURE__ */ createIcon(LuMaximize, 'Maximize');
export const MenuIcon = /* @__PURE__ */ createIcon(LuMenu, 'Menu');
export const MinimizeIcon = /* @__PURE__ */ createIcon(LuMinimize, 'Minimize');
export const MonitorIcon = /* @__PURE__ */ createIcon(LuMonitor, 'Monitor');
export const MoonIcon = /* @__PURE__ */ createIcon(LuMoon, 'Moon');
export const PaletteIcon = /* @__PURE__ */ createIcon(LuPalette, 'Palette');
export const PanelsTopLeftIcon = /* @__PURE__ */ createIcon(
  LuPanelsTopLeft,
  'PanelsTopLeft',
);
export const PencilIcon = /* @__PURE__ */ createIcon(LuPencil, 'Pencil');
export const PinIcon = /* @__PURE__ */ createIcon(LuPin, 'Pin');
export const PlusIcon = /* @__PURE__ */ createIcon(LuPlus, 'Plus');
export const QrCodeIcon = /* @__PURE__ */ createIcon(LuQrCode, 'QrCode');
export const RefreshCwIcon = /* @__PURE__ */ createIcon(LuRefreshCw, 'RefreshCw');
export const RotateCwIcon = /* @__PURE__ */ createIcon(LuRotateCw, 'RotateCw');
export const SaveIcon = /* @__PURE__ */ createIcon(LuSave, 'Save');
export const SearchIcon = /* @__PURE__ */ createIcon(LuSearch, 'Search');
export const SettingsIcon = /* @__PURE__ */ createIcon(LuSettings, 'Settings');
export const SmileIcon = /* @__PURE__ */ createIcon(LuSmile, 'Smile');
export const StarIcon = /* @__PURE__ */ createIcon(LuStar, 'Star');
export const SunIcon = /* @__PURE__ */ createIcon(LuSun, 'Sun');
export const TagIcon = /* @__PURE__ */ createIcon(LuTag, 'Tag');
export const Trash2Icon = /* @__PURE__ */ createIcon(LuTrash2, 'Trash2');
export const TypeIcon = /* @__PURE__ */ createIcon(LuType, 'Type');
export const Undo2Icon = /* @__PURE__ */ createIcon(LuUndo2, 'Undo2');
export const WrenchIcon = /* @__PURE__ */ createIcon(LuWrench, 'Wrench');
export const XIcon = /* @__PURE__ */ createIcon(LuX, 'X');

export const MinusIcon = /* @__PURE__ */ createIcon(LuMinus, 'Minus');

export const ClockIcon = /* @__PURE__ */ createIcon(LuClock, 'Clock');
export const ArrowRightIcon = /* @__PURE__ */ createIcon(LuArrowRight, 'ArrowRight');
export const ClockArrowUpIcon = /* @__PURE__ */ createIcon(
  LuClockArrowUp,
  'ClockArrowUp',
);
export const ClockArrowDownIcon = /* @__PURE__ */ createIcon(
  LuClockArrowDown,
  'ClockArrowDown',
);
export const PanelLeftIcon = /* @__PURE__ */ createIcon(LuPanelLeft, 'PanelLeft');
export const PanelRightIcon = /* @__PURE__ */ createIcon(LuPanelRight, 'PanelRight');
