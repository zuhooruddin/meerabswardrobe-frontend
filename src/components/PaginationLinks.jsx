import Head from "next/head";
import { useRouter } from "next/router";

/**
 * PaginationLinks component for SEO
 * Adds rel="next" and rel="prev" links for paginated content
 * 
 * @param {Object} props
 * @param {number} props.currentPage - Current page number (1-indexed)
 * @param {number} props.totalPages - Total number of pages
 * @param {string} props.baseUrl - Base URL for pagination (without page parameter)
 */
const PaginationLinks = ({ currentPage, totalPages, baseUrl }) => {
  const router = useRouter();
  const baseUrlWithPath = baseUrl || router.asPath.split('?')[0];
  
  // Build pagination URLs
  const getPageUrl = (page) => {
    if (page === 1) {
      return baseUrlWithPath;
    }
    const separator = baseUrlWithPath.includes('?') ? '&' : '?';
    return `${baseUrlWithPath}${separator}page=${page}`;
  };

  const prevUrl = currentPage > 1 ? getPageUrl(currentPage - 1) : null;
  const nextUrl = currentPage < totalPages ? getPageUrl(currentPage + 1) : null;

  return (
    <Head>
      {prevUrl && <link rel="prev" href={prevUrl} />}
      {nextUrl && <link rel="next" href={nextUrl} />}
    </Head>
  );
};

export default PaginationLinks;

