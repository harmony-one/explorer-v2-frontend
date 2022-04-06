const downloadBlob = (content: any, filename: string, contentType: string) => {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);

  // Create a link to download it
  const pom = document.createElement('a');
  pom.href = url;
  pom.setAttribute('download', filename);
  pom.click();
}

export const downloadCSV = (data: any[], filename: string) => {
  const header= data.filter((_, index) => index === 0).map(item => Object.keys(item))
  const body = data
    .map((item) => Object.values(item))

  const csv = [...header, ...body]
    .map(row =>
      row
        .map(String)  // convert every value to String
        .map((v: any) => v.replaceAll('"', '""'))  // escape double colons
        // .map((v: any) => `"${v}"`)  // quote it
        .join(', ')  // comma-separated
    ).join('\r\n');  // rows starting on new lines

  downloadBlob(csv, filename, 'text/csv;charset=utf-8;')
}
