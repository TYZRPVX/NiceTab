import { Form, Input, Radio, theme } from 'antd';
import type { FormItemProps, FormInstance } from 'antd';
import type { SettingsProps } from '~/entrypoints/types';
import { ENUM_SETTINGS_PROPS } from '~/entrypoints/common/constants';
import { useIntlUtls } from '~/entrypoints/common/hooks/global';
import useTooltipOption from '~/entrypoints/common/hooks/tooltipOption';

const { TAB_SORT_DOMAIN_ORDER_MODE, TAB_SORT_CUSTOM_DOMAIN_LIST } = ENUM_SETTINGS_PROPS;

export default function FormModuleTabSort(
  props: FormItemProps & { form: FormInstance<SettingsProps> },
) {
  const { token } = theme.useToken();
  const { $fmt } = useIntlUtls();
  const { form, ...formItemProps } = props;
  const { getFormTooltipOption } = useTooltipOption();

  const domainOrderMode = Form.useWatch(TAB_SORT_DOMAIN_ORDER_MODE, form);

  return (
    <Form.Item noStyle {...formItemProps}>
      {/* 域名分组顺序方式 */}
      <Form.Item<SettingsProps>
        label={$fmt({
          id: `settings.${TAB_SORT_DOMAIN_ORDER_MODE}`,
          values: { mark: '：' },
        })}
        name={TAB_SORT_DOMAIN_ORDER_MODE}
        tooltip={getFormTooltipOption({
          title: $fmt(`settings.${TAB_SORT_DOMAIN_ORDER_MODE}.tooltip`),
        })}
      >
        <Radio.Group>
          <Radio value="alphabetical">
            {$fmt(`settings.${TAB_SORT_DOMAIN_ORDER_MODE}.alphabetical`)}
          </Radio>
          <Radio value="custom">
            {$fmt(`settings.${TAB_SORT_DOMAIN_ORDER_MODE}.custom`)}
          </Radio>
        </Radio.Group>
      </Form.Item>
      {/* 自定义域名优先级列表 */}
      {domainOrderMode === 'custom' && (
        <Form.Item<SettingsProps>
          label={$fmt({
            id: `settings.${TAB_SORT_CUSTOM_DOMAIN_LIST}`,
            values: { mark: '：' },
          })}
          name={TAB_SORT_CUSTOM_DOMAIN_LIST}
          tooltip={getFormTooltipOption({
            title: $fmt(`settings.${TAB_SORT_CUSTOM_DOMAIN_LIST}.tooltip`),
          })}
        >
          <Input.TextArea
            style={{ width: '500px' }}
            autoSize={{ minRows: 3, maxRows: 8 }}
            placeholder={$fmt(`settings.${TAB_SORT_CUSTOM_DOMAIN_LIST}.placeholder`)}
          />
        </Form.Item>
      )}
    </Form.Item>
  );
}
