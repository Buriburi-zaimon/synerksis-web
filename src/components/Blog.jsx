import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { client } from '../sanityClient';
import { PortableText } from '@portabletext/react';
import { Calendar, ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';

export default function Blog({ fadeUpVariant, staggerContainer }) {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all published posts ordered by newest first
    const query = `*[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      publishedAt,
      "imageUrl": mainImage.asset->url,
      body
    }`;

    client.fetch(query)
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching blog posts:', err);
        setLoading(false);
      });
  }, []);

  // Single Post Reader View
  if (selectedPost) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-grow flex flex-col py-12 px-6 md:px-12 max-w-3xl mx-auto w-full relative z-10"
      >
        <button 
          onClick={() => setSelectedPost(null)}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-8 transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" /> Back to publications
        </button>

        {selectedPost.imageUrl && (
          <img 
            src={selectedPost.imageUrl} 
            alt={selectedPost.title} 
            className="w-full h-64 md:h-96 object-cover rounded-3xl mb-8 border border-white/10 shadow-2xl"
          />
        )}

        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500 mb-4">
          <Calendar className="w-4 h-4" />
          {selectedPost.publishedAt ? new Date(selectedPost.publishedAt).toLocaleDateString() : 'Recent'}
        </div>

        <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight uppercase mb-10 leading-tight">
          {selectedPost.title}
        </h1>

        <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed font-light space-y-6 pb-20">
          <PortableText value={selectedPost.body} />
        </div>
      </motion.div>
    );
  }

  // Blog Feed List View
  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-grow flex flex-col justify-center py-12 px-6 md:px-12 lg:px-20 w-full max-w-[1400px] mx-auto relative z-10"
    >
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="text-center max-w-2xl mx-auto mb-16"
      >
        <motion.div variants={fadeUpVariant} className="flex items-center justify-center gap-3 text-gray-400 font-medium tracking-widest text-[11px] uppercase mb-4">
          <BookOpen className="w-4 h-4" />
          <span>Research & Insights</span>
        </motion.div>
        <motion.h2 variants={fadeUpVariant} className="text-4xl md:text-5xl font-bold text-white tracking-tight uppercase">
          Latest Publications
        </motion.h2>
        <motion.p variants={fadeUpVariant} className="mt-6 text-gray-400 font-light leading-relaxed text-[15px] md:text-base">
          Updates, clinical research findings, and technical deep-dives from the Synerksis Labs engineering team.
        </motion.p>
      </motion.div>

      {loading ? (
        <div className="text-center text-gray-500 py-16 animate-pulse">Loading publications...</div>
      ) : posts.length === 0 ? (
        <div className="text-center text-gray-500 py-16 p-8 rounded-3xl bg-black/40 border border-white/[0.05] backdrop-blur-md max-w-2xl mx-auto">
          No publications found yet. Add your first post in Sanity Studio!
        </div>
      ) : (
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
        >
          {posts.map((post) => (
            <motion.div 
              key={post._id} 
              variants={fadeUpVariant}
              onClick={() => setSelectedPost(post)}
              className="group cursor-pointer flex flex-col p-6 rounded-3xl bg-black/40 border border-white/[0.05] hover:bg-black/60 transition-colors duration-500 backdrop-blur-md"
            >
              {post.imageUrl ? (
                <div className="w-full h-48 rounded-2xl overflow-hidden mb-5 border border-white/[0.08]">
                  <img 
                    src={post.imageUrl} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                  />
                </div>
              ) : (
                <div className="w-full h-48 rounded-2xl bg-white/[0.02] border border-white/[0.05] mb-5 flex items-center justify-center">
                   <BookOpen className="w-10 h-10 text-white/20" />
                </div>
              )}

              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500 mb-3">
                <Calendar className="w-3.5 h-3.5" />
                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Recent'}
              </div>

              <h3 className="text-xl font-bold text-white tracking-wide mb-4 group-hover:text-gray-300 transition-colors line-clamp-2">
                {post.title}
              </h3>

              <div className="flex items-center gap-2 text-sm text-white/80 font-medium mt-auto pt-4 border-t border-white/5">
                <span>Read article</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.main>
  );
}