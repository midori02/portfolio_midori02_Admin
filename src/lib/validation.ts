export const isValidMinLength = (target: string, minLength: number): boolean => {
  if (target.length >= minLength) {
    return true
  } else return false
}

export const isValidMaxLength = (target: string, maxLength: number): boolean => {
  if (target.length <= maxLength) {
    return true
  } else return false
}

export const isValidPhoneNumber = (postalCode: string): boolean => {
  if (postalCode.match(/^0\d{1,4}-\d{1,4}-\d{3,4}$/)) {
    return true
  } else {
    alert(`電話番号の形式が不正です。ハイフンありでご入力ください。`)
    return false
  }
}
export const isValidPostalCode = (postCode: string): boolean => {
  if (postCode.match(/^\d{3}-\d{4}$/)) {
    return true
  } else {
    alert(`郵便番号の形式が不正です。ハイフンありの7桁の数字をご入力ください。`)
    return false
  }
}
export const isValidEmailFormat = (email: string): boolean => {
  const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  if (!regex.test(email)) alert('メールアドレスの形式が不正です。')
  return regex.test(email)
}
export const isValidRequiredInput = (target: string, keyword?: string): boolean => {
  if (target === '') {
    if (keyword) {
      alert(`${keyword}が未入力です。${keyword}を入力してください。`)
    }
    return false
  } else {
    return true
  }
}