interface StructuredDataProps {
  data: object;
}

export default function StructuredData({ data }: StructuredDataProps) {
  // JSON.stringify는 <, > 를 escape하지 않아 사용자 데이터(게시글 제목 등)에
  // </script> 가 포함되면 스크립트 태그를 빠져나오는 XSS가 가능하다.
  // 위험 문자를 유니코드 이스케이프하여 차단한다.
  const json = JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
