import { Container, Box, Typography, Divider, Chip, Stack } from "@mui/material";
import ShopLayout1 from "components/layouts/ShopLayout1";
import SEO from "components/SEO";
import { H1, H2, H3, Paragraph } from "components/Typography";
import LazyImage from "components/LazyImage";
import { AccessTime, Person } from "@mui/icons-material";
import format from "date-fns/format";
import Link from "next/link";
import StructuredData from "components/schema/StructuredData";

// Import blog posts with error handling
let blogPosts = [];
try {
  const blogData = require("../../src/data/blog-posts");
  blogPosts = blogData.blogPosts || [];
} catch (error) {
  console.error("Error loading blog posts:", error);
  blogPosts = [];
}


const BlogPostPage = ({ post, allPosts }) => {

  if (!post) {
    return (
      <ShopLayout1 navCategories={[]}>
        <Container sx={{ py: 4, textAlign: "center" }}>
          <H1>Post Not Found</H1>
          <Paragraph>The blog post you're looking for doesn't exist.</Paragraph>
          <Link href="/blog">Back to Blog</Link>
        </Container>
      </ShopLayout1>
    );
  }

  // Generate Article structured data
  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.description,
    "image": post.imgUrl,
    "datePublished": post.publishedTime,
    "dateModified": post.modifiedTime || post.publishedTime,
    "author": {
      "@type": "Organization",
      "name": "Chitral Hive",
      "url": "https://chitralhive.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Chitral Hive",
      "logo": {
        "@type": "ImageObject",
        "url": "https://chitralhive.com/images/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://chitralhive.com/blog/${post.slug}`
    },
    "articleSection": post.section,
    "keywords": post.tags?.join(", ") || ""
  };

  return (
    <ShopLayout1 navCategories={[]}>
      <SEO
        title={post.title}
        description={post.description}
        metaTitle={post.metaTitle || post.title}
        keywords={post.tags?.join(", ") || ""}
        canonical={`https://chitralhive.com/blog/${post.slug}`}
        type="article"
        publishedTime={post.publishedTime}
        modifiedTime={post.modifiedTime || post.publishedTime}
        author="Chitral Hive"
        section={post.section}
        tags={post.tags}
        image={post.imgUrl}
      />
      <StructuredData data={articleStructuredData} />
      <Container sx={{ py: 4, maxWidth: "900px" }}>
        <Box component="article">
          {/* Header */}
          <Box component="header" sx={{ mb: 4 }}>
            <H1 component="h1" sx={{ mb: 2 }}>
              {post.title}
            </H1>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2, flexWrap: "wrap" }}>
              <Box sx={{ display: "flex", alignItems: "center", color: "text.secondary" }}>
                <AccessTime sx={{ mr: 1, fontSize: "1rem" }} />
                <Typography variant="body2">
                  {post.publishedTime 
                    ? format(new Date(post.publishedTime), "MMMM dd, yyyy")
                    : "N/A"}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", color: "text.secondary" }}>
                <Person sx={{ mr: 1, fontSize: "1rem" }} />
                <Typography variant="body2">Chitral Hive</Typography>
              </Box>
              {post.section && (
                <Chip label={post.section} size="small" color="primary" />
              )}
            </Stack>
            {post.tags && post.tags.length > 0 && (
              <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                {post.tags.map((tag, index) => (
                  <Chip key={index} label={tag} size="small" variant="outlined" />
                ))}
              </Stack>
            )}
          </Box>

          {/* Featured Image */}
          {post.imgUrl && (
            <Box sx={{ mb: 4 }}>
              <LazyImage
                width={900}
                height={500}
                src={post.imgUrl}
                alt={post.title}
                layout="responsive"
                sx={{ borderRadius: 2 }}
              />
            </Box>
          )}

          <Divider sx={{ mb: 4 }} />

          {/* Content */}
          <Box
            component="div"
            sx={{
              "& h2": {
                mt: 4,
                mb: 2,
                fontSize: "1.75rem",
                fontWeight: 600,
              },
              "& h3": {
                mt: 3,
                mb: 1.5,
                fontSize: "1.5rem",
                fontWeight: 600,
              },
              "& p": {
                mb: 2,
                lineHeight: 1.8,
              },
              "& ul, & ol": {
                mb: 2,
                pl: 3,
                "& li": {
                  mb: 1,
                  lineHeight: 1.8,
                },
              },
            }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Related Posts */}
        {post.relatedPosts && post.relatedPosts.length > 0 && (
          <Box>
            <H2 component="h2" sx={{ mb: 3 }}>
              Related Articles
            </H2>
            <Stack spacing={2}>
              {post.relatedPosts.map((relatedSlug) => {
                const relatedPost = allPosts.find((p) => p.slug === relatedSlug);
                if (!relatedPost) return null;
                return (
                  <Link key={relatedSlug} href={`/blog/${relatedSlug}`} style={{ textDecoration: "none" }}>
                    <Box
                      sx={{
                        p: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                        "&:hover": {
                          borderColor: "primary.main",
                          bgcolor: "action.hover",
                        },
                      }}
                    >
                      <H3 component="h3" sx={{ fontSize: "1.25rem", mb: 1 }}>
                        {relatedPost.title}
                      </H3>
                      <Paragraph color="text.secondary" sx={{ mb: 0 }}>
                        {relatedPost.description}
                      </Paragraph>
                    </Box>
                  </Link>
                );
              })}
            </Stack>
          </Box>
        )}
      </Container>
    </ShopLayout1>
  );
};

export async function getStaticPaths() {
  try {
    // Ensure blogPosts is an array and has valid slugs
    const validPosts = Array.isArray(blogPosts) 
      ? blogPosts.filter(post => post && post.slug)
      : [];
    
    const paths = validPosts.map((post) => ({
      params: { slug: post.slug },
    }));

    return {
      paths,
      fallback: false, // Return 404 for unknown slugs
    };
  } catch (error) {
    console.error('Error in blog getStaticPaths:', error);
    return {
      paths: [],
      fallback: false,
    };
  }
}

export async function getStaticProps({ params }) {
  try {
    // Ensure blogPosts is an array
    const posts = Array.isArray(blogPosts) ? blogPosts : [];
    const post = posts.find((p) => p && p.slug === params.slug);

    if (!post) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        post,
        allPosts: posts,
      },
      // Note: revalidate is not supported in static export mode
    };
  } catch (error) {
    console.error('Error in blog getStaticProps:', error);
    return {
      notFound: true,
    };
  }
}

export default BlogPostPage;

