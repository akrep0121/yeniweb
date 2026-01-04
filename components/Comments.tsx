'use client';

import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { CheckCircle, Clock, User } from 'lucide-react';

interface Comment {
  id: string;
  blogId: string;
  name: string;
  email: string;
  comment: string;
  createdAt: string;
  approved: boolean;
}

interface CommentsProps {
  blogId: string;
  comments: Comment[];
}

export default function Comments({ blogId, comments }: CommentsProps) {
  const approvedComments = comments.filter(c => c.blogId === blogId && c.approved);
  const pendingComments = comments.filter(c => c.blogId === blogId && !c.approved);

  if (approvedComments.length === 0 && pendingComments.length === 0) {
    return (
      <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
        <div className="flex items-center gap-3 text-gray-400">
          <User className="w-6 h-6" />
          <p>Henüz yorum yapılmamış. İlk yorum sen yap!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {approvedComments.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white mb-4">
            Yorumlar ({approvedComments.length})
          </h3>
          <div className="space-y-4">
            {approvedComments.map((comment) => (
              <div
                key={comment.id}
                className="bg-gray-800 rounded-xl p-6 border border-gray-700"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white font-bold">
                      {comment.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-white">{comment.name}</h4>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-400">
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                          locale: tr,
                        })}
                      </span>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{comment.comment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {pendingComments.length > 0 && (
        <div className="bg-yellow-900/20 border border-yellow-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-yellow-600" />
            <h4 className="font-semibold text-yellow-600">
              Onay Bekleyen Yorumlar ({pendingComments.length})
            </h4>
          </div>
          <p className="text-sm text-gray-400 mb-4">
            Bu yorumlar admin onayından sonra görünecek.
          </p>
          <div className="space-y-3">
            {pendingComments.map((comment) => (
              <div
                key={comment.id}
                className="bg-gray-800 rounded-lg p-4 border border-gray-700 opacity-60"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-gray-300">{comment.name}</span>
                  <span className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(comment.createdAt), {
                      addSuffix: true,
                      locale: tr,
                    })}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">{comment.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
