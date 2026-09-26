import React, { useState, useEffect } from 'react';
import {
  MapPin,
  AlertTriangle,
  MessageSquare,
  Search,
  ThumbsUp,
  PlusCircle,
  Compass,
  X,
  Camera,
  Check,
} from 'lucide-react';
import {
  CommunityDiseaseReport,
  CommunityPost,
  UserSession,
} from '../types';
import {
  TOMATO_EARLY_BLIGHT_IMAGE,
  EXPERT_AVATAR_IMAGE,
  FARMER_AVATARS,
  SAMPLE_PLANT_PRESETS,
} from '../data/plantImages';
import { useFirebase } from '../firebase/FirebaseContext';
import { Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';

interface CommunityPageProps {
  userSession: UserSession;
  reports: CommunityDiseaseReport[];
  posts: CommunityPost[];
  onAddPost: (post: Omit<CommunityPost, 'id' | 'timeAgo' | 'likes' | 'replies'>) => void;
  onOpenExpert: () => void;
}

// Controller to smoothly pan & zoom Google Map when search or center changes
function MapCameraController({
  targetCoords,
}: {
  targetCoords: { lat: number; lng: number; zoom?: number } | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (map && targetCoords) {
      map.panTo({ lat: targetCoords.lat, lng: targetCoords.lng });
      if (targetCoords.zoom) {
        map.setZoom(targetCoords.zoom);
      }
    }
  }, [map, targetCoords]);

  return null;
}

export const CommunityPage: React.FC<CommunityPageProps> = ({
  userSession,
  reports,
  posts: initialPosts,
  onAddPost,
  onOpenExpert,
}) => {
  const { updateCommunityPostInCloud } = useFirebase();
  const [activeSubTab, setActiveSubTab] = useState<'map' | 'discussions'>('map');
  const [posts, setPosts] = useState<CommunityPost[]>(initialPosts);
  const [selectedReport, setSelectedReport] = useState<CommunityDiseaseReport | null>(reports[0]);
  const [searchLocationQuery, setSearchLocationQuery] = useState('');
  const [selectedCropFilter, setSelectedCropFilter] = useState<string>('all');
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCrop, setNewPostCrop] = useState('Tomato');
  const [newPostImageUrl, setNewPostImageUrl] = useState<string>(SAMPLE_PLANT_PRESETS[0].image);
  const [replyInputMap, setReplyInputMap] = useState<Record<string, string>>({});

  const [mapTargetCoords, setMapTargetCoords] = useState<{
    lat: number;
    lng: number;
    zoom?: number;
  } | null>(null);

  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  const handleCenterOnUser = () => {
    const lat = userSession.latitude || 19.9975;
    const lng = userSession.longitude || 73.7898;
    setMapTargetCoords({ lat, lng, zoom: 11 });
  };

  const handleLocationSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchLocationQuery.trim()) return;

    const q = searchLocationQuery.toLowerCase();
    const matched = reports.find((r) =>
      r.locationName.toLowerCase().includes(q) ||
      r.crop.toLowerCase().includes(q) ||
      r.diseaseName.toLowerCase().includes(q)
    );
    if (matched) {
      setMapTargetCoords({ lat: matched.lat, lng: matched.lng, zoom: 12 });
      setSelectedReport(matched);
      return;
    }

    const INDIAN_AGRO_REGIONS: Record<string, [number, number]> = {
      nashik: [19.9975, 73.7898],
      dindori: [20.2012, 73.8344],
      niphad: [20.0814, 74.1084],
      sinnar: [19.8458, 74.0016],
      yeola: [20.0422, 74.4883],
      malegaon: [20.5539, 74.5288],
      pune: [18.5204, 73.8567],
      manchar: [19.0062, 73.9452],
      ludhiana: [30.9010, 75.8573],
      punjab: [30.9010, 75.8573],
      karnal: [29.6857, 76.9905],
      haryana: [29.0588, 76.0856],
      guntur: [16.3067, 80.4365],
      andhra: [16.3067, 80.4365],
      bengaluru: [13.1363, 77.5684],
      karnataka: [13.1363, 77.5684],
      thanjavur: [10.7870, 79.1378],
      tamil: [10.7870, 79.1378],
      varanasi: [25.3176, 82.9739],
      anand: [22.5645, 72.9289],
      gujarat: [22.5645, 72.9289],
      maharashtra: [19.9975, 73.7898],
    };

    const foundKey = Object.keys(INDIAN_AGRO_REGIONS).find((k) => q.includes(k));
    if (foundKey) {
      const coords = INDIAN_AGRO_REGIONS[foundKey];
      setMapTargetCoords({ lat: coords[0], lng: coords[1], zoom: 11 });
    }
  };

  const handleLikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isLiked = !p.isLiked;
          const updated = {
            ...p,
            isLiked,
            likes: isLiked ? p.likes + 1 : p.likes - 1,
          };
          updateCommunityPostInCloud(updated).catch((e) =>
            console.warn('Could not sync like to cloud:', e)
          );
          return updated;
        }
        return p;
      })
    );
  };

  const handleAddReply = (postId: string) => {
    const text = replyInputMap[postId]?.trim();
    if (!text) return;

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const updated = {
            ...p,
            replies: [
              ...p.replies,
              {
                id: `rep-${Date.now()}`,
                author: userSession.name,
                isExpert: false,
                text,
                time: 'Just now',
              },
            ],
          };
          updateCommunityPostInCloud(updated).catch((e) =>
            console.warn('Could not sync reply to cloud:', e)
          );
          return updated;
        }
        return p;
      })
    );

    setReplyInputMap((prev) => ({ ...prev, [postId]: '' }));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    onAddPost({
      authorName: userSession.name,
      authorRole: 'Grower',
      location: userSession.location,
      title: newPostTitle,
      content: newPostContent,
      crop: newPostCrop,
      diseaseTag: `${newPostCrop} Health`,
      imageUrl: newPostImageUrl,
    });

    setNewPostTitle('');
    setNewPostContent('');
    setShowCreatePostModal(false);
  };

  const filteredPosts =
    selectedCropFilter === 'all'
      ? posts
      : posts.filter((p) => p.crop.toLowerCase().includes(selectedCropFilter));

  const initialLat = userSession.latitude || 19.9975;
  const initialLng = userSession.longitude || 73.7898;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      
      {/* Community Page Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E2C20] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-[0_0_10px_rgba(0,255,102,0.3)]">
              Indian Agro Intelligence &amp; Community Radar
            </h1>
            <span className="text-xs bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/30 px-2.5 py-0.5 rounded-full font-bold">
              Live Field Network
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Real-time disease tracking map across Indian agricultural valleys, outbreak warnings, and grower discussions.
          </p>
        </div>

        {/* Subtabs Selector */}
        <div className="flex items-center gap-1 bg-[#121913] p-1.5 rounded-xl border border-[#202E22] self-start sm:self-auto">
          <button
            onClick={() => setActiveSubTab('map')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'map'
                ? 'bg-[#00FF66] text-[#0A0D0A] shadow-neon-sm'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            🗺️ Live Outbreak Map
          </button>
          <button
            onClick={() => setActiveSubTab('discussions')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'discussions'
                ? 'bg-[#00FF66] text-[#0A0D0A] shadow-neon-sm'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            💬 Agro Talk ({posts.length})
          </button>
        </div>
      </div>

      {/* SUBTAB 1: LIVE OUTBREAK MAP & DISEASE ALERTS */}
      {activeSubTab === 'map' && (
        <div className="space-y-6">
          
          {/* Active Area Outbreak Banner */}
          <div className="bg-[#141C15] border border-[#FF3355]/40 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 shrink-0">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-red-400">
                    🚨 Disease Alert
                  </span>
                  <span className="text-xs text-stone-600">·</span>
                  <span className="text-xs font-semibold text-stone-400">
                    Reported Cases / Community Signal
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-0.5">
                  Leaf Blast &amp; Blight — Multiple incidents monitored in agro-belts
                </h3>
                <p className="text-xs text-stone-400 mt-1 max-w-2xl leading-relaxed">
                  Active farmer reports recorded across Maharashtra, Punjab, Karnataka &amp; Indian agro-belts.
                  High nocturnal humidity (&gt;85%) along canal basins and morning fog may accelerate fungal blast and blight spore dispersal.
                </p>
              </div>
            </div>

            <button
              onClick={onOpenExpert}
              className="h-10 px-4 rounded-xl bg-[#00FF66] text-[#0A0D0A] text-xs font-bold hover:bg-[#33FF85] shrink-0 transition-all shadow-neon-sm cursor-pointer"
            >
              Consult Agronomist
            </button>
          </div>

          {/* Interactive Geographical Map Box */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="lg:col-span-2 bg-[#0E1410] rounded-2xl border border-[#1E2C20] shadow-xl overflow-hidden flex flex-col h-[520px]">
              
              <div className="p-3 border-b border-[#1C281E] bg-[#121913] flex items-center justify-between gap-3 flex-wrap">
                <form onSubmit={handleLocationSearch} className="flex-1 min-w-[200px] relative">
                  <input
                    type="text"
                    value={searchLocationQuery}
                    onChange={(e) => setSearchLocationQuery(e.target.value)}
                    placeholder="Search Indian agricultural district (e.g. Nashik, Dindori, Pune, Ludhiana)..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[#2B3D2F] text-xs bg-[#172219] text-white focus:outline-none focus:border-[#00FF66]"
                  />
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                </form>

                <button
                  onClick={handleCenterOnUser}
                  className="px-3 py-1.5 rounded-lg border border-[#2B3D2F] bg-[#172219] text-stone-200 text-xs font-semibold hover:border-[#00FF66] flex items-center gap-1.5 cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5 text-[#00FF66]" />
                  <span>My Farm Region</span>
                </button>
              </div>

              {/* Google Maps Container */}
              <div className="relative flex-1 w-full bg-[#080B09] h-full min-h-[420px]">
                <Map
                  mapId="DEMO_MAP_ID"
                  defaultCenter={{ lat: initialLat, lng: initialLng }}
                  defaultZoom={8}
                  style={{ width: '100%', height: '100%' }}
                  gestureHandling="greedy"
                  disableDefaultUI={false}
                  internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                >
                  <MapCameraController targetCoords={mapTargetCoords} />

                  {/* Disease Outbreak Advanced Markers */}
                  {reports.map((rep) => {
                    const markerColor =
                      rep.severity === 'high' || rep.severity === 'critical'
                        ? '#FF2A4D'
                        : rep.severity === 'moderate'
                        ? '#FF9900'
                        : '#00FF66';

                    return (
                      <AdvancedMarker
                        key={rep.id}
                        position={{ lat: rep.lat, lng: rep.lng }}
                        onClick={() => setSelectedReport(rep)}
                        title={`${rep.diseaseName} (${rep.crop}) — ${rep.reportsCount} field reports`}
                      >
                        <div
                          className="cursor-pointer transition-transform hover:scale-125 flex items-center justify-center rounded-full text-black font-extrabold text-[11px] shadow-lg select-none"
                          style={{
                            backgroundColor: markerColor,
                            width: '32px',
                            height: '32px',
                            border: '3px solid #000',
                            boxShadow: `0 0 14px ${markerColor}`,
                          }}
                        >
                          {rep.reportsCount}
                        </div>
                      </AdvancedMarker>
                    );
                  })}

                  {/* Farmer's Own Location Advanced Marker */}
                  <AdvancedMarker
                    position={{ lat: initialLat, lng: initialLng }}
                    title={`My Farm: ${userSession.location}`}
                  >
                    <div className="flex flex-col items-center cursor-pointer group">
                      <div className="w-8 h-8 rounded-full border-2 border-[#00FF66] shadow-[0_0_12px_#00FF66] overflow-hidden bg-black">
                        <img
                          src={FARMER_AVATARS[userSession.name] || FARMER_AVATARS['Rajesh Sharma']}
                          alt={userSession.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <span className="text-[10px] bg-black/90 text-[#00FF66] font-bold px-1.5 py-0.5 rounded border border-[#00FF66]/40 mt-1 whitespace-nowrap shadow-neon-sm">
                        My Farm
                      </span>
                    </div>
                  </AdvancedMarker>
                </Map>

                {/* Map legend overlay */}
                <div className="absolute bottom-4 left-4 z-10 bg-black/90 backdrop-blur-md p-2.5 rounded-xl border border-[#1E2B20] text-[10px] space-y-1 text-stone-200 pointer-events-none shadow-xl">
                  <div className="font-bold text-[#00FF66] mb-0.5">Disease Risk Density</div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_6px_#EF4444]" />
                    <span>High Concentration (🔴 25+ reports)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-400 shadow-[0_0_6px_#FB923C]" />
                    <span>Moderate Risk (🟠 10-24 reports)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00FF66] shadow-[0_0_6px_#00FF66]" />
                    <span>Low / Monitored (🟢 &lt;10 reports)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Disease Report Sidebar */}
            <div className="space-y-4">
              <div className="bg-[#0E1410] rounded-2xl border border-[#1E2C20] p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-[#1C281E] pb-3">
                  <h3 className="font-bold text-sm text-white">
                    Selected Disease Zone
                  </h3>
                  <span className="text-[10px] text-[#00FF66]">
                    Click pin to view
                  </span>
                </div>

                {selectedReport ? (
                  <div className="space-y-3.5">
                    <div className="w-full aspect-16/10 rounded-xl overflow-hidden bg-black border border-[#00FF66]/30 relative">
                      <img
                        src={selectedReport.samplePhotoUrl || TOMATO_EARLY_BLIGHT_IMAGE}
                        alt={selectedReport.diseaseName}
                        className="w-full h-full object-cover opacity-90"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = TOMATO_EARLY_BLIGHT_IMAGE;
                        }}
                      />
                      <div className="absolute top-2 right-2 bg-black/80 text-[#00FF66] border border-[#00FF66]/40 text-[10px] font-bold px-2 py-0.5 rounded shadow-neon-sm">
                        {selectedReport.reportsCount} Field Reports
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] text-stone-400 uppercase font-bold">
                        {selectedReport.crop} Pathogen
                      </div>
                      <h4 className="text-lg font-bold text-white">
                        {selectedReport.diseaseName}
                      </h4>
                      <div className="text-xs text-stone-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-[#00FF66]" />
                        <span>{selectedReport.locationName}</span>
                      </div>
                    </div>

                    {selectedReport.spreadAlert && (
                      <div className="space-y-2 pt-2 border-t border-[#1C281E] text-xs">
                        <div>
                          <strong className="text-white block mb-1">
                            Why it may spread:
                          </strong>
                          <ul className="list-disc pl-4 space-y-0.5 text-stone-300 text-[11px]">
                            {selectedReport.spreadAlert.causes.map((c, i) => (
                              <li key={i}>{c}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <strong className="text-white block mb-1">
                            Recommended Prevention:
                          </strong>
                          <ul className="list-disc pl-4 space-y-0.5 text-stone-300 text-[11px]">
                            {selectedReport.spreadAlert.prevention.map((p, i) => (
                              <li key={i}>{p}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6 space-y-3">
                    <div className="w-16 h-16 mx-auto rounded-xl overflow-hidden border border-[#202E22] bg-black">
                      <img
                        src={reports[0]?.samplePhotoUrl || TOMATO_EARLY_BLIGHT_IMAGE}
                        alt="Regional Crop Specimen"
                        className="w-full h-full object-cover opacity-80"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <p className="text-xs text-stone-400">
                      Click any marker on the map to inspect local Indian outbreak details.
                    </p>
                  </div>
                )}
              </div>

              {/* Common Diseases Near You List */}
              <div className="bg-[#0E1410] rounded-2xl border border-[#1E2C20] p-4 shadow-xl">
                <h3 className="font-bold text-xs text-white uppercase tracking-wider mb-2.5">
                  Common Diseases Near You
                </h3>
                <div className="space-y-2 text-xs">
                  {reports.slice(0, 4).map((r) => (
                    <div
                      key={r.id}
                      onClick={() => {
                        setSelectedReport(r);
                        setMapTargetCoords({ lat: r.lat, lng: r.lng, zoom: 11 });
                      }}
                      className="p-2.5 rounded-xl border border-[#1E2C20] hover:border-[#00FF66] bg-[#121913] cursor-pointer flex items-center justify-between transition-colors gap-3 group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-black border border-[#202E22] group-hover:border-[#00FF66]/50 shrink-0">
                          <img
                            src={r.samplePhotoUrl}
                            alt={r.diseaseName}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-white truncate group-hover:text-[#00FF66] transition-colors">
                            {r.diseaseName}
                          </div>
                          <div className="text-[11px] text-stone-400 truncate">
                            {r.crop} · {r.locationName}
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-bold text-stone-200 block text-[11px]">
                          {r.reportsCount} reports
                        </span>
                        <div className="text-[10px] font-bold text-red-400">
                          {r.severity === 'high' || r.severity === 'critical' ? '🔴 High Risk' : '🟠 Moderate'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: AGRO TALK FORUM */}
      {activeSubTab === 'discussions' && (
        <div className="space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="text-xs font-bold text-stone-400">Filter:</span>
              {['all', 'tomato', 'chilli', 'paddy', 'potato', 'cucumber', 'corn', 'brinjal'].map((crop) => (
                <button
                  key={crop}
                  onClick={() => setSelectedCropFilter(crop)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold capitalize whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCropFilter === crop
                      ? 'bg-[#00FF66] text-[#0A0D0A] shadow-neon-sm'
                      : 'bg-[#141B15] text-stone-300 hover:bg-[#1C271E] border border-[#233325]'
                  }`}
                >
                  {crop === 'all' ? 'All Crops' : crop}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowCreatePostModal(true)}
              className="h-10 px-4 rounded-xl bg-[#00FF66] text-[#0A0D0A] text-xs font-bold hover:bg-[#33FF85] transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-neon-sm"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span>Post to Agro Talk</span>
            </button>
          </div>

          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-[#0E1410] rounded-2xl border border-[#1E2B20] p-5 shadow-xl space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={FARMER_AVATARS[post.authorName] || FARMER_AVATARS['Ramesh Patel']}
                      alt={post.authorName}
                      className="w-10 h-10 rounded-full object-cover border border-[#00FF66]/40 shadow-neon-sm shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">
                          {post.authorName}
                        </span>
                        <span className="text-stone-600">·</span>
                        <span className="text-xs text-stone-400">
                          {post.authorRole}
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-500 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#00FF66]" />
                        <span>{post.location}</span>
                        <span>·</span>
                        <span>{post.timeAgo}</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/30 px-2.5 py-0.5 rounded-full">
                    {post.crop}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-white text-base mb-1.5">
                    {post.title}
                  </h3>
                  <p className="text-xs text-stone-300 leading-relaxed whitespace-pre-line">
                    {post.content}
                  </p>
                </div>

                {post.imageUrl && (
                  <div className="max-w-md aspect-16/10 rounded-xl overflow-hidden border border-[#233325] bg-black">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = TOMATO_EARLY_BLIGHT_IMAGE;
                      }}
                    />
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-[#1C281E] text-xs text-stone-400">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLikePost(post.id)}
                      className={`flex items-center gap-1.5 font-bold transition-colors cursor-pointer ${
                        post.isLiked ? 'text-[#00FF66]' : 'hover:text-white'
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>{post.likes} Helpful</span>
                    </button>
                    <span className="flex items-center gap-1 text-stone-400">
                      <MessageSquare className="w-4 h-4" />
                      <span>{post.replies.length} Replies</span>
                    </span>
                  </div>
                </div>

                {post.replies.length > 0 && (
                  <div className="space-y-2 bg-[#121913] rounded-xl p-3 border border-[#1E2B20]">
                    {post.replies.map((reply) => (
                      <div key={reply.id} className="text-xs space-y-1">
                        <div className="flex items-center gap-2">
                          <img
                            src={
                              reply.isExpert
                                ? EXPERT_AVATAR_IMAGE
                                : FARMER_AVATARS[reply.author] ||
                                  FARMER_AVATARS['Rajesh Sharma']
                            }
                            alt={reply.author}
                            className="w-5 h-5 rounded-full object-cover border border-[#00FF66]/50 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <span className="font-bold text-white">
                            {reply.author}
                          </span>
                          {reply.isExpert && (
                            <span className="text-[10px] font-bold bg-[#00FF66]/20 text-[#00FF66] px-1.5 py-0.2 rounded border border-[#00FF66]/40">
                              ✓ Verified Agronomist
                            </span>
                          )}
                          <span className="text-[10px] text-stone-500">
                            · {reply.time}
                          </span>
                        </div>
                        <p className="text-stone-300 leading-snug pl-7">
                          {reply.text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={replyInputMap[post.id] || ''}
                    onChange={(e) =>
                      setReplyInputMap((prev) => ({
                        ...prev,
                        [post.id]: e.target.value,
                      }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddReply(post.id);
                    }}
                    placeholder="Share advice or ask in Agro Talk..."
                    className="flex-1 px-3.5 py-2 rounded-xl border border-[#2B3E2F] text-xs focus:outline-none focus:border-[#00FF66] bg-[#141C15] text-white"
                  />
                  <button
                    onClick={() => handleAddReply(post.id)}
                    className="h-9 px-4 rounded-xl bg-[#00FF66] text-[#0A0D0A] text-xs font-bold hover:bg-[#33FF85] transition-all cursor-pointer"
                  >
                    Reply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create New Post Modal */}
      {showCreatePostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-[#0E1310] rounded-2xl max-w-lg w-full p-6 border border-[#00FF66]/30 shadow-neon space-y-4 animate-in fade-in zoom-in-95 duration-200 text-stone-200">
            <div className="flex items-center justify-between border-b border-[#1E2B20] pb-3">
              <h3 className="font-bold text-base text-white">
                Share Field Observation in Agro Talk
              </h3>
              <button
                onClick={() => setShowCreatePostModal(false)}
                className="text-stone-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-300 mb-1">
                  Crop Category
                </label>
                <select
                  value={newPostCrop}
                  onChange={(e) => setNewPostCrop(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#2A3C2D] bg-[#141C15] text-white text-xs"
                >
                  <option value="Tomato">Tomato</option>
                  <option value="Chilli">Chilli &amp; Pepper</option>
                  <option value="Paddy">Paddy (Rice)</option>
                  <option value="Potato">Potato</option>
                  <option value="Cucumber">Cucumber / Squash</option>
                  <option value="Brinjal">Brinjal (Eggplant)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-300 mb-1">
                  Topic / Summary
                </label>
                <input
                  type="text"
                  required
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="e.g. Unusual spots appearing after morning fog on lower stems"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#2A3C2D] bg-[#141C15] text-white text-xs focus:border-[#00FF66] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-300 mb-1">
                  Detailed Field Observation
                </label>
                <textarea
                  required
                  rows={4}
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Describe leaf symptoms, irrigation method, weather over past 48 hours..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#2A3C2D] bg-[#141C15] text-white text-xs focus:border-[#00FF66] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-300 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-[#00FF66]" />
                    <span>Attach Foliar Specimen Photo</span>
                  </span>
                  <span className="text-[10px] text-stone-400">Select specimen for diagnosis</span>
                </label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {SAMPLE_PLANT_PRESETS.filter((p) => p.id !== 'sample-invalid-blurry').slice(0, 4).map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setNewPostImageUrl(preset.image);
                        setNewPostCrop(preset.crop);
                      }}
                      className={`relative aspect-4/3 rounded-lg overflow-hidden border transition-all cursor-pointer ${
                        newPostImageUrl === preset.image
                          ? 'border-[#00FF66] shadow-[0_0_8px_#00FF66]'
                          : 'border-[#233325] hover:border-stone-500 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={preset.image}
                        alt={preset.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      {newPostImageUrl === preset.image && (
                        <div className="absolute inset-0 bg-[#00FF66]/20 flex items-center justify-center">
                          <Check className="w-4 h-4 text-[#00FF66] stroke-[3]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreatePostModal(false)}
                  className="px-4 py-2 rounded-xl text-stone-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#00FF66] text-[#0A0D0A] font-bold hover:bg-[#33FF85] transition-all cursor-pointer shadow-neon-sm"
                >
                  Publish Observation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
