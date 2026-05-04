/**
 * React 컴포넌트 패키지용 ESLint.
 * base에 react / react-hooks / jsx-a11y를 추가.
 */

/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: [
    './base.cjs',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
  ],
  settings: {
    react: { version: 'detect' },
  },
  rules: {
    'react/prop-types': 'off',
    'react/display-name': 'error',
    'react-hooks/exhaustive-deps': 'error',
    /**
     * jsx-a11y/label-has-associated-control은 기본적으로 native input/select/textarea만
     * "control"로 인지합니다. @baneung-pack/ui의 커스텀 컨트롤 컴포넌트를 등록해
     * `<label><Switch /> 알림</label>` 같은 합법적 패턴이 false-positive를 내지 않도록 합니다.
     */
    'jsx-a11y/label-has-associated-control': [
      'error',
      {
        controlComponents: [
          'Checkbox',
          'Input',
          'InputGroup',
          'InputOTP',
          'RadioGroup',
          'RadioGroupItem',
          'Slider',
          'Switch',
          'Textarea',
        ],
      },
    ],
  },
};
