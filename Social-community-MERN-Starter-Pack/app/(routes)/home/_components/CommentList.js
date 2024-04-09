import { UserDetailContext } from '@//_context/UserDetailContext'
import { MoreVertical, Trash } from 'lucide-react'
import Image from 'next/image'
import React, { useContext, useState } from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@Component//ui/popover"
import { Button } from '@Component//ui/button'
import GlobalApi from '@//_utils/GlobalApi'
import { useToast } from '@Component//ui/use-toast'

  


function CommentList({ commenentList ,updatePostList}) {
    const { userDetail, setUserDetail } = useContext(UserDetailContext)
    const {toast} = useToast()
    const [commenentListData,setCommentListData] = useState(commenentList)
    const onDeleteComment=(comment)=>{
        const result = commenentListData.filter(item=>item._id!==comment._id)
        setCommentListData(result)
       GlobalApi.deleteComment(comment._id).then(res=>{
        if(res){
            toast({
                title:'Deleted',
                description:'Comment Delete Successfully.'
            })
        }
       })
       updatePostList()
        }
    return (
        <div>
            {
                commenentListData.map((item, index) => (
                    <div className='flex p-3 border rounded-lg m-2 items-center'>
                        <div className=' flex items-center gap-3 w-full'>
                            <Image
                                src={item?.createdBy?.image}
                                alt='user-image'
                                height={30}
                                width={30}
                                className=' rounded-full'
                            />
                            <h2 className=' bg-slate-100 p-2 rounded-lg'>{item.commentText}</h2>
                        </div>
                        {item.createdBy?._id === userDetail?._id && <Popover>
                            <PopoverTrigger><MoreVertical className=' h-5 w-5 cursor-pointer' /></PopoverTrigger>
                            <PopoverContent>
                                <Button 
                                   className=" w-full flex gap-2"
                                   variant="outline"
                                   onClick={()=>onDeleteComment(item)}
                                >
                                    <Trash/> Delete
                                </Button>
                            </PopoverContent>
                        </Popover>}
                    </div>
                ))
            }
        </div>
    )
}

export default CommentList