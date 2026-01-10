import { Container, Grid, Box } from "@mui/material";
import ShopLayout1 from "components/layouts/ShopLayout1";
import SEO from "components/SEO";
import { H1, H2, Paragraph } from "components/Typography";
import BlogCard1 from "components/blog-cards/BlogCard1";

// Import blog posts with error handling
let blogPosts = [];
try {
  const blogData = require("../../src/data/blog-posts");
  blogPosts = blogData.blogPosts || [];
} catch (error) {
  console.error("Error loading blog posts:", error);
  blogPosts = [];
}


const BlogPage = ({ posts }) => {
  return (
    <ShopLayout1 navCategories={[]}>
      <SEO

      
        title="Blog - Women's Fashion, Style Tips & Guides"
        description="Discover fashion trends, styling tips, product guides, and stories about women's clothing. Learn about fashion trends, styling tips, and contemporary women's fashion in Europe."
        metaTitle="Women's Fashion Blog - Style Tips & Fashion Guides | Meerab's Wardrobe"
        keywords="women's fashion blog, style tips, fashion trends, clothing guides, women's fashion Europe, styling tips, fashion articles, women's clothing trends, fashion inspiration, wardrobe tips"
        canonical={`${process.env.NEXT_PUBLIC_URL || "https://meerabs.com"}/blog`}
        type="website"
      />
      <Container sx={{ py: 4 }}>
        <Box component="header" sx={{ mb: 5, textAlign: "center" }}>
          <H1 component="h1" sx={{ mb: 2 }}>
            Meerab's Wardrobe Blog
          </H1>
          <Paragraph color="text.secondary" sx={{ maxWidth: "800px", mx: "auto" }}>
            Discover fashion trends, styling tips, product guides, and stories about women's clothing and fashion in Europe
          </Paragraph>
        </Box>

        <Grid container spacing={4}>
          {posts && posts.length > 0 ? (
            posts.map((post) => {
              // Transform post data to match BlogCard1 expected format
              const blogCardData = {
                ...post,
                createdAt: post.publishedTime || post.createdAt || new Date().toISOString(),
                comments: post.comments || 0,
                url: post.slug ? `/blog/${post.slug}` : '#',
              };
              // Only render if post has required fields
              if (!post.slug || !post.title) return null;
              return (
                <Grid item xs={12} md={6} key={post.slug}>
                  <BlogCard1 blog={blogCardData} />
                </Grid>
              );
            }).filter(Boolean)
          ) : (
            <Grid item xs={12}>
              <Paragraph>No blog posts available.</Paragraph>
            </Grid>
          )}
        </Grid>
      </Container>
    </ShopLayout1>
  );
};

export async function getStaticProps() {
  try {
    // Ensure blogPosts is an array
    const posts = Array.isArray(blogPosts) ? blogPosts : [];
    
    return {
      props: {
        posts,
      },
      // Note: revalidate is not supported in static export mode
    };
  } catch (error) {
    console.error('Error in blog getStaticProps:', error);
    return {
      props: {
        posts: [],
      },
    };
  }
}

export default BlogPage;

